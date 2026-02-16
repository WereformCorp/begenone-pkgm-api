import axios from "axios";

/**
 * Uploads a file to S3 using AWS multipart upload.
 *
 * @param {Object} params
 * @param {File} params.file - File to upload
 * @param {string} params.channelId - Channel ID
 * @param {string} params.AWS_API_URL - AWS service base URL
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
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
    // Chunk size for each part (10MB — AWS S3 multipart minimum is 5MB except last part)
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);

    const mime = filetype === "video" ? "video/mp4" : "image/jpeg";

    console.log(
      ` AWS_API_URL in uploadVideoMultipart: `,
      `${AWS_API_URL}${AWS_INIT_ENDPOINT}`,
    );

    // 1. Initiate multipart upload — backend returns uploadId and S3 object key
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
      },
    );

    const { uploadId, key } = initData;
    const parts = [];

    // 2. Upload each chunk: get presigned URL → PUT to S3 → collect ETag for completion
    for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
      const start = (partNumber - 1) * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Fetch presigned S3 PUT URL for this part
      const { data: presigned } = await axios.get(
        `${AWS_API_URL}/${MULTIPART_PART_URL}`,
        {
          params: { key, uploadId, partNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { url } = presigned;

      // Upload chunk directly to S3 via presigned URL (no backend relay)
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

    // 3. Complete multipart upload — backend tells S3 to assemble parts into final object
    await axios.post(
      `${AWS_API_URL}/${MULTIPART_COMPLETE_URL}`,
      { key, uploadId, parts, channelId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Return the S3 object key (path) for the uploaded file
    return key;
  } catch (error) {
    console.error(
      "Multipart Upload Error:",
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
}
