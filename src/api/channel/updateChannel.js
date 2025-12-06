import axios from "axios";

// Function to fetch channel data for React components
export const updateChannel = async (
  channelId,
  name,
  about,
  channelUserName,
  CHANNEL_API_URL
) => {
  try {
    // Fetch data from the backend API endpoint

    const UPDATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const { data: channelData } = await axios.patch(
      `${CHANNEL_API_URL}${UPDATE_CHANNEL_ENDPOINT}${channelId}`,
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
      "UPDATE CHANNEL error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
