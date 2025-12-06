import axios from "axios";

// Function to fetch channel data for React components
export const deleteChannel = async (channelId, CHANNEL_API_URL) => {
  try {
    // Fetch data from the backend API endpoint

    const DELETE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const { data: channelData } = await axios.delete(
      `${CHANNEL_API_URL}${DELETE_CHANNEL_ENDPOINT}${channelId}`,
      {
        withCredentials: true, // ✅ this includes cookies/session info
      }
    );

    console.log(`Channel Data: `, channelData);

    return channelData;
  } catch (error) {
    console.error(
      "DELETE CHANNEL error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
