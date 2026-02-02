import axios from "axios";
// import calculateTimeAgo from "../../utils/calculateTimeAgo";

/**
 * Fetches an overview of videos and channels for the home feed.
 * Enriches videos with thumbnails, channel logos, and time-ago metadata.
 *
 * @param {Object} params
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object>} Overview feed data
 */
export const deleteVideo = async ({
  VIDEO_ID,
  VIDEO_API_URL,
  VIDEO_API_ENDPOINT,
  TOKEN,
}) => {
  try {
    console.log(`REQUEST REACHED TO DELETE VIDEO FUNCTION`);

    const data = await axios.delete(
      `${VIDEO_API_URL}${VIDEO_API_ENDPOINT}${VIDEO_ID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
      },
    );

    return data;
  } catch (error) {
    console.log(
      "Delete Video Error:",
      error?.response?.data || error?.message || error,
    );
    return null;
  }
};
