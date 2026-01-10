import axios from "axios";

/**
 * @function updateVideoInteraction
 *
 * @description
 * Sends a PATCH request to the Video Engagement API to register
 * a user interaction (like, unlike, dislike, undislike) on a video.
 *
 * This function is intentionally **stateless and UI-agnostic**.
 * It performs a network mutation only and returns server-authoritative data.
 *
 * @param {string} videoId
 * Unique identifier of the video being interacted with.
 *
 * @param {("like"|"unlike"|"dislike"|"undislike")} action
 * Type of interaction to perform.
 *
 * @param {string} VIDEO_API_URL
 * Base URL of the Video service.
 *
 * @param {string} UPDATE_VIDEO_INTERACTION_ENDPOINT
 * API route prefix for interaction updates.
 *
 * @returns {Promise<{likes: number, dislikes: number}>}
 * Updated engagement counts returned by the backend.
 *
 * @throws {Error}
 * Throws if the network request fails or the server responds with an error.
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * const stats = await updateVideoInteraction(
 *   "videoId123",
 *   "like",
 *   VIDEO_API_URL,
 *   "/api/v1/videos/route-engagement/interaction/"
 * );
 */
export const updateVideoInteraction = async (
  videoId,
  action,
  VIDEO_API_URL,
  UPDATE_VIDEO_INTERACTION_ENDPOINT
) => {
  const response = await axios.patch(
    `${VIDEO_API_URL}${UPDATE_VIDEO_INTERACTION_ENDPOINT}${videoId}/${action}`,
    {},
    {
      withCredentials: true,
    }
  );

  return {
    likes: response.data.likes,
    dislikes: response.data.dislikes,
  };
};
