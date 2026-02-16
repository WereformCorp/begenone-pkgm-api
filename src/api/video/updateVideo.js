import axios from "axios";

/**
 * @function updateVideo
 *
 * @description
 * Sends a PATCH request to the Video API to update video metadata.
 * Maps to the backend route: PATCH /api/v1/videos/:id
 *
 * The backend calls Video.findByIdAndUpdate(req.params.id, req.body)
 * so any valid Mongoose update operators (e.g. $inc) can be passed via dataObj.
 *
 * @param {Object} params
 * @param {string} params.videoId - The video document ID
 * @param {Object} params.dataObj - Fields/operators to update on the video
 * @param {string} params.VIDEO_API_URL - Base URL of the Video service
 * @param {string} params.UPDATE_VIDEO_ENDPOINT - API route prefix
 * @param {string} [params.token] - Bearer token for authentication
 *
 * @example
 * const result = await updateVideo({
 *   videoId: "abc123",
 *   dataObj: { $inc: { views: 1 } },
 *   VIDEO_API_URL: "https://api-video.begenone.com",
 *   UPDATE_VIDEO_ENDPOINT: "/api/v1/videos/route-video/",
 * });
 *
 * @returns {Promise<Object>} Updated video data from the server
 * @throws {Error} Throws if the request fails
 */
export const updateVideo = async ({
  videoId,
  dataObj,
  VIDEO_API_URL,
  UPDATE_VIDEO_ENDPOINT,
  token = null,
}) => {
  try {
    console.log("Updating video", videoId, dataObj);

    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    const response = await axios.patch(
      `${VIDEO_API_URL}${UPDATE_VIDEO_ENDPOINT}${videoId}/views`,
      dataObj,
      {
        headers,
        withCredentials: true,
      },
    );

    if (
      response.data.status &&
      response.data.status.toLowerCase() === "success"
    ) {
      console.log("Video updated successfully", response.data);
      return response.data.data;
    } else {
      throw new Error("Failed to update video");
    }
  } catch (error) {
    console.log("Error in updateVideo", error);
    throw error;
  }
};
