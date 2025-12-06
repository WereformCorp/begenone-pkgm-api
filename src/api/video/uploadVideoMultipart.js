import axios from "axios";

export async function uploadVideoMultipart({
  file,
  channelId,
  AWS_API_URL,
  token,
  filetype,
}) {
  try {
    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
    const totalParts = Math.ceil(file.size / CHUNK_SIZE);

    const mime = filetype === "video" ? "video/mp4" : "image/jpeg";

    const AWS_INIT_ENDPOINT = "/api/v1/aws/s3/multipart/init";

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

      // Get presigned URL
      const { data: presigned } = await axios.get(
        `${AWS_API_URL}/api/v1/aws/s3/multipart/part-url`,
        {
          params: { key, uploadId, partNumber },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { url } = presigned;

      // ✅ REAL DIRECT S3 UPLOAD
      // const uploadRes = await axios.put(url, chunk, {
      //   headers: {
      //     "Content-Type": mime,
      //   },
      // });

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

    // 3️⃣ COMPLETE MULTIPART
    await axios.post(
      `${AWS_API_URL}/api/v1/aws/s3/multipart/complete`,
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
      "Login error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
}
