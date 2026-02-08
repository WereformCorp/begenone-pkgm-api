import axios from "axios";

/**
 * @function updateLikesDislikes
 *
 * @description
 * Sends a PATCH request to the Video API to register
 * a user interaction (like, dislike, view) on a video.
 *
 * Maps to the backend route: PATCH /api/v1/videos/:videoId/:action
 *
 * @param {Object} params
 * @param {string} params.videoId - Unique identifier of the video
 * @param {("like"|"dislike"|"view")} params.action - Type of interaction
 * @param {string} params.VIDEO_API_URL - Base URL of the Video service
 * @param {string} params.UPDATE_LIKES_DISLIKES_ENDPOINT - API route prefix
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * const result = await updateLikesDislikes({
 *   videoId: "abc123",
 *   action: "view",
 *   VIDEO_API_URL: "https://api-video.begenone.com",
 *   UPDATE_LIKES_DISLIKES_ENDPOINT: "/api/v1/videos/route-engagement/interaction/",
 * });
 *
 * @returns {Promise<Object>} Server response data
 * @throws {Error} Throws if the network request fails
 */
export const updateLikesDislikes = async ({
  videoId,
  action,
  VIDEO_API_URL,
  UPDATE_LIKES_DISLIKES_ENDPOINT,
}) => {
  try {
    const response = await axios.patch(
      `${VIDEO_API_URL}${UPDATE_LIKES_DISLIKES_ENDPOINT}${videoId}/${action}`,
      {},
      {
        withCredentials: true,
      },
    );

    if (
      response.data.status &&
      response.data.status.toLowerCase() === "success"
    ) {
      return response.data;
    } else {
      throw new Error("Failed to update likes/dislikes");
    }
  } catch (error) {
    console.log("Error in updateLikesDislikes", error);
    throw error;
  }
};
