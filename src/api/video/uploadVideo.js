// import axios from "axios";

// export const uploadVideo = async (
//   title,
//   description,
//   videoFile,
//   thumbnailFile,
//   onProgress,
//   VIDEO_API_URL
// ) => {
//   if (!title) throw new Error("Title is required.");

//   const formattedDescription = description.replace(/\n/g, "<br>");

//   const formData = new FormData();
//   formData.append("title", title);
//   formData.append("description", formattedDescription);
//   formData.append("video", videoFile);
//   formData.append("thumbnail", thumbnailFile);

//   const response = await axios.post(
//     `${VIDEO_API_URL}/api/v1/videos/route-video/`,
//     formData,
//     {
//       withCredentials: true,
//       onUploadProgress: progressEvent => {
//         const percent = Math.round(
//           (progressEvent.loaded * 100) / progressEvent.total
//         );
//         onProgress(percent);
//       },
//     }
//   );

//   return response.data;
// };

import axios from "axios";
import * as Mime from "react-native-mime-types";

export async function uploadVideoMobile({
  title,
  description,
  videoUri,
  thumbnailUri,
  token,
  onProgress,
  VIDEO_API_URL,
}) {
  if (!title || !title.trim()) {
    throw new Error("Title is required.");
  }

  const formData = new FormData();

  formData.append("title", title);
  formData.append("description", description || "");

  // -------------------- VIDEO --------------------
  if (videoUri) {
    const ext = videoUri.split(".").pop();
    const mimeType = Mime.lookup(ext) || "video/mp4";

    formData.append("video", {
      uri: videoUri,
      name: `upload.${ext}`,
      type: mimeType,
    });
  }

  // -------------------- THUMBNAIL --------------------
  if (thumbnailUri) {
    const ext = thumbnailUri.split(".").pop();
    const mimeType = Mime.lookup(ext) || "image/jpeg";

    formData.append("thumbnail", {
      uri: thumbnailUri,
      name: `thumb.${ext}`,
      type: mimeType,
    });
  }

  console.log("FINAL FORMDATA → ");
  for (const entry of formData) console.log(entry);

  const response = await axios.post(
    `${VIDEO_API_URL}/api/v1/videos/route-video/`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: evt => {
        if (evt.total) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          onProgress?.(percent);
        }
      },
    }
  );

  return response.data;
}
