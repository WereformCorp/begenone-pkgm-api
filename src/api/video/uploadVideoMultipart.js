import axios from "axios";

/**
 * Uploads a file to S3 using AWS multipart upload.
 *
 * @param {Object} params
 * @param {File} params.file - File to upload
 * @param {string} params.channelId - Channel ID
 * @param {string} params.AWS_API_URL - AWS service base URL
 * @param {string} params.token - Auth token
 * @param {"video"|"thumbnail"} params.filetype - File type
 * @returns {Promise<string>} Uploaded file key
 */
export async function uploadVideoMultipart({
  file,
  channelId,
  AWS_API_URL,
  token,
  filetype,
  AWS_INIT_ENDPOINT,
  MULTIPART_PART_URL,
  MULTIPART_COMPLETE_URL,
}) {
  try {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);

    const mime = filetype === "video" ? "video/mp4" : "image/jpeg";
    // const AWS_INIT_ENDPOINT = "/api/v1/aws/s3/multipart/init";

    console.log(
      ` AWS_API_URL in uploadVideoMultipart: `,
      `${AWS_API_URL}${AWS_INIT_ENDPOINT}`
    );

    // 1️⃣ INIT MULTIPART
    const { data: initData } = await axios.post(
      `${AWS_API_URL}${AWS_INIT_ENDPOINT}`,
      {
        channelId,
        filetype,
        mimeType: mime,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { uploadId, key } = initData;
    const parts = [];

    // 2️⃣ UPLOAD EACH PART
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // const MULTIPART_PART_URL = "api/v1/aws/s3/multipart/part-url";

      const { data: presigned } = await axios.get(
        `${AWS_API_URL}/${MULTIPART_PART_URL}`,
        {
          params: { key, uploadId, partNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { url } = presigned;

      const putRes = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": mime,
        },
        body: chunk,
      });

      if (!putRes.ok) {
        throw new Error(`S3 PUT failed for part ${partNumber}`);
      }

      const etag = putRes.headers.get("ETag");
      parts.push({ partNumber, ETag: etag });
    }

    // MULTIPART_COMPLETE_URL = "api/v1/aws/s3/multipart/complete"
    // 3️⃣ COMPLETE MULTIPART
    await axios.post(
      `${AWS_API_URL}/${MULTIPART_COMPLETE_URL}`,
      { key, uploadId, parts },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return key;
  } catch (error) {
    console.error(
      "Multipart Upload Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
}
