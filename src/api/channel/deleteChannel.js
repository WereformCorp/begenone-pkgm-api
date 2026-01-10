import axios from "axios";

/**
 * Deletes a channel by ID.
 *
 * @param {string} channelId - Channel unique ID
 * @param {string} CHANNEL_API_URL - Channel service base URL
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object>} Delete response data
 */
export const deleteChannel = async ({
  channelId,
  CHANNEL_API_URL,
  DELETE_CHANNEL_ENDPOINT,
}) => {
  try {
    const config = {
      withCredentials: true, // ✅ includes cookies/session info
    };

    const { data: channelData } = await axios.delete(
      `${CHANNEL_API_URL}${DELETE_CHANNEL_ENDPOINT}${channelId}`,
      config
    );

    console.log("Delete Channel | Response:", channelData);

    return channelData;
  } catch (error) {
    console.error(
      "DELETE CHANNEL Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
