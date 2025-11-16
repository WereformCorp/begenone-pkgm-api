import axios from "axios";

export const uploadVideo = async (
  title,
  description,
  videoFile,
  thumbnailFile,
  onProgress,
  VIDEO_API_URL
) => {
  if (!title) throw new Error("Title is required.");

  const formattedDescription = description.replace(/\n/g, "<br>");

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", formattedDescription);
  formData.append("video", videoFile);
  formData.append("thumbnail", thumbnailFile);

  const response = await axios.post(
    `${VIDEO_API_URL}/api/v1/videos/route-video/`,
    formData,
    {
      withCredentials: true,
      onUploadProgress: progressEvent => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      },
    }
  );

  return response.data;
};
