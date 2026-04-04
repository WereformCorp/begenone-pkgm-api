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
 * @param {string|null} [params.token]
 * Bearer JWT — required on mobile (React Native has no session cookies).
 *
 * @returns {Promise<{likes: number, dislikes: number, userLiked?: boolean, userDisliked?: boolean}>}
 * Updated engagement counts and user flags from the backend.
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
export const updateVideoInteraction = async ({
  videoId,
  action,
  VIDEO_API_URL,
  UPDATE_VIDEO_INTERACTION_ENDPOINT,
  token = null,
}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axios.patch(
      `${VIDEO_API_URL}${UPDATE_VIDEO_INTERACTION_ENDPOINT}${videoId}/${action}`,
      {},
      {
        headers,
        withCredentials: true,
      },
    );

    if (
      response.data.status &&
      response.data.status.toLowerCase() === "success"
    ) {
      return {
        likes: response.data.likes,
        dislikes: response.data.dislikes,
        userLiked: response.data.userLiked,
        userDisliked: response.data.userDisliked,
      };
    } else {
      throw new Error("Failed to update video interaction");
    }
  } catch (error) {
    console.log("Error in updateVideoInteraction", error);
    throw error;
  }
};
