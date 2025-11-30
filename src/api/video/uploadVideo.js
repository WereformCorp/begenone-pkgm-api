import axios from "axios";
import { uploadVideoMultipart } from "./uploadVideoMultipart";

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

    console.log(`Video Key from Upload Video Function: `, videoKey);

    // 2️⃣ Upload thumbnail if present (can be simple PUT, not multipart)
    let thumbnailKey = null;
    if (thumbnail) {
      thumbnailKey = await uploadVideoMultipart({
        file: thumbnail,
        channelId,
        AWS_API_URL,
        token,
        filetype: "thumbnail",
      });

      console.log(`Thumbnail Key from Upload Video Function: `, thumbnailKey);
    }

    // 3️⃣ Create DB record
    const { data } = await axios.post(
      `${VIDEO_API_URL}/api/v1/videos/route-video/`,
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
      console.log(`Data from Video Upload: `, data);
      return data;
    }
  } catch (err) {
    console.error(`Upload Video Package Error:`, err);
    throw err;
  }
}

// // export const uploadVideo = async (
// //   title,
// //   description,
// //   videoFile,
// //   thumbnailFile,
// //   onProgress,
// //   VIDEO_API_URL
// // ) => {
// //   if (!title) throw new Error("Title is required.");

// //   const formattedDescription = description.replace(/\n/g, "<br>");

// //   const formData = new FormData();
// //   formData.append("title", title);
// //   formData.append("description", formattedDescription);
// //   formData.append("video", videoFile);
// //   formData.append("thumbnail", thumbnailFile);

// //   const response = await axios.post(
// //     `${VIDEO_API_URL}/api/v1/videos/route-video/`,
// //     formData,
// //     {
// //       withCredentials: true,
// //       onUploadProgress: progressEvent => {
// //         const percent = Math.round(
// //           (progressEvent.loaded * 100) / progressEvent.total
// //         );
// //         onProgress(percent);
// //       },
// //     }
// //   );

// //   return response.data;
// // };

// import axios from "axios";
// import * as Mime from "react-native-mime-types";

// export async function uploadVideoMobile({
//   title,
//   description,
//   videoUri,
//   thumbnailUri,
//   token,
//   onProgress,
//   VIDEO_API_URL,
// }) {
//   if (!title || !title.trim()) {
//     throw new Error("Title is required.");
//   }

//   const formData = new FormData();

//   formData.append("title", title);
//   formData.append("description", description || "");

//   // -------------------- VIDEO --------------------
//   if (videoUri) {
//     const ext = videoUri.split(".").pop();
//     const mimeType = Mime.lookup(ext) || "video/mp4";

//     formData.append("video", {
//       uri: videoUri,
//       name: `upload.${ext}`,
//       type: mimeType,
//     });
//   }

//   // -------------------- THUMBNAIL --------------------
//   if (thumbnailUri) {
//     const ext = thumbnailUri.split(".").pop();
//     const mimeType = Mime.lookup(ext) || "image/jpeg";

//     formData.append("thumbnail", {
//       uri: thumbnailUri,
//       name: `thumb.${ext}`,
//       type: mimeType,
//     });
//   }

//   console.log("FINAL FORMDATA → ");
//   for (const entry of formData) console.log(entry);

//   const response = await axios.post(
//     `${VIDEO_API_URL}/api/v1/videos/route-video/`,
//     formData,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: evt => {
//         if (evt.total) {
//           const percent = Math.round((evt.loaded / evt.total) * 100);
//           onProgress?.(percent);
//         }
//       },
//     }
//   );

//   return response.data;
// }
