// import axios from "axios";
// import { uploadVideoMultipart } from "./uploadVideoMultipart";

// export async function uploadVideo({
//   title,
//   description,
//   file,
//   thumbnail,
//   token,
//   VIDEO_API_URL,
//   AWS_API_URL,
//   channelId,
// }) {
//   try {
//     // 1️⃣ Upload video to S3 (multipart)
//     const videoKey = await uploadVideoMultipart({
//       file,
//       channelId,
//       AWS_API_URL,
//       token,
//       filetype: "video",
//     });

//     console.log(`Video Key from Upload Video Function: `, videoKey);

//     // 2️⃣ Upload thumbnail if present (can be simple PUT, not multipart)
//     let thumbnailKey = null;
//     if (thumbnail) {
//       thumbnailKey = await uploadVideoMultipart({
//         file: thumbnail,
//         channelId,
//         AWS_API_URL,
//         token,
//         filetype: "thumbnail",
//       });

//       console.log(`Thumbnail Key from Upload Video Function: `, thumbnailKey);
//     }

//     const UPLOAD_VIDEO_ENDPOINT = `/api/v1/videos/route-video/`;

//     // 3️⃣ Create DB record
//     const { data } = await axios.post(
//       `${VIDEO_API_URL}${UPLOAD_VIDEO_ENDPOINT}`,
//       {
//         title,
//         description,
//         videoKey,
//         thumbnailKey,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (data) {
//       console.log(`Data from Video Upload: `, data);
//       return data;
//     }
//   } catch (err) {
//     console.error(`Upload Video Package Error:`, err);
//     throw err;
//   }
// }

import axios from "axios";
import { uploadVideoMultipart } from "./uploadVideoMultipart";

/**
 * Uploads a video and optional thumbnail, then creates DB record.
 *
 * @param {Object} params
 * @param {string} params.title - Video title
 * @param {string} params.description - Video description
 * @param {File} params.file - Video file
 * @param {File|null} params.thumbnail - Thumbnail image file
 * @param {string} params.token - Auth token
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @param {string} params.AWS_API_URL - AWS service base URL
 * @param {string} params.channelId - Channel ID
 * @returns {Promise<Object>} Uploaded video data
 */
export async function uploadVideo({
  title,
  description,
  file,
  thumbnail,
  token,
  VIDEO_API_URL,
  AWS_API_URL,
  channelId,
}) {
  try {
    // 1️⃣ Upload video to S3 (multipart)
    const videoKey = await uploadVideoMultipart({
      file,
      channelId,
      AWS_API_URL,
      token,
      filetype: "video",
    });

    console.log("Video Key from Upload:", videoKey);

    // 2️⃣ Upload thumbnail if present
    let thumbnailKey = null;
    if (thumbnail) {
      thumbnailKey = await uploadVideoMultipart({
        file: thumbnail,
        channelId,
        AWS_API_URL,
        token,
        filetype: "thumbnail",
      });

      console.log("Thumbnail Key from Upload:", thumbnailKey);
    }

    const UPLOAD_VIDEO_ENDPOINT = "/api/v1/videos/route-video/";

    // 3️⃣ Create DB record
    const { data } = await axios.post(
      `${VIDEO_API_URL}${UPLOAD_VIDEO_ENDPOINT}`,
      {
        title,
        description,
        videoKey,
        thumbnailKey,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data) {
      console.log("Data from Video Upload:", data);
      return data;
    }
  } catch (err) {
    console.error("Upload Video Package Error:", err);
    throw err;
  }
}
