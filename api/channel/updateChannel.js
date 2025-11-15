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
    const { data: channelData } = await axios.patch(
      `${CHANNEL_API_URL}/api/v1/channels/channel-routes/${channelId}`,
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
    console.error("Error fetching channel data:", error);
    throw error; // Propagate error if needed
  }
};
