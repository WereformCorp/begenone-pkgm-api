import axios from "axios";

/**
 * Creates a new channel for the authenticated user.
 *
 * @param {Object} params - Channel creation payload
 * @param {string} params.name - Channel display name
 * @param {string} params.about - Channel description
 * @param {string} params.channelUserName - Public channel username
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @returns {Promise<Object>} Created channel data
 */
export const createChannel = async ({
  NAME,
  ABOUT,
  CHANNEL_USERNAME,
  CHANNEL_API_URL,
  CREATE_CHANNEL_ENDPOINT,
}) => {
  try {
    // const CREATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const payload = {
      name: NAME,
      about: ABOUT,
      channelUserName: CHANNEL_USERNAME,
    };

    const config = {
      withCredentials: true, // ✅ includes cookies/session info
    };

    const { data: channelData } = await axios.post(
      `${CHANNEL_API_URL}${CREATE_CHANNEL_ENDPOINT}`,
      payload,
      config
    );

    console.log("Create Channel | Response:", channelData);

    return channelData;
  } catch (error) {
    console.error(
      "CREATE CHANNEL Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
