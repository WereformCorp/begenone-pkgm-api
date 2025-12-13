import axios from "axios";

/**
 * Updates an existing channel's core information.
 *
 * @param {Object} params - Channel update payload
 * @param {string} params.channelId - Channel unique ID
 * @param {string} params.name - Updated channel name
 * @param {string} params.about - Updated channel description
 * @param {string} params.channelUserName - Updated public username
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @returns {Promise<Object>} Updated channel data
 */
export const updateChannel = async ({
  channelId,
  name,
  about,
  channelUserName,
  CHANNEL_API_URL,
  UPDATE_CHANNEL_ENDPOINT,
}) => {
  try {
    // const UPDATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const payload = {
      name,
      about,
      channelUserName,
    };

    const config = {
      withCredentials: true, // ✅ includes cookies/session info
    };

    const { data: channelData } = await axios.patch(
      `${CHANNEL_API_URL}${UPDATE_CHANNEL_ENDPOINT}${channelId}`,
      payload,
      config
    );

    console.log("Update Channel | Response:", channelData);

    return channelData;
  } catch (error) {
    console.error(
      "UPDATE CHANNEL Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
