import axios from "axios";

// Function to fetch channel data for React components
export const createChannel = async ({
  name,
  about,
  channelUserName,
  CHANNEL_API_URL,
}) => {
  try {
    // Fetch data from the backend API endpoint

    const CREATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const { data: channelData } = await axios.post(
      `${CHANNEL_API_URL}${CREATE_CHANNEL_ENDPOINT}`,
      {
        name,
        about,
        channelUserName,
      },
      {
        withCredentials: true, // ✅ this includes cookies/session info
      }
    );

    console.log(`Channel Data: `, channelData);

    return channelData;
  } catch (error) {
    console.error(
      "CREATE CHANNEL error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
