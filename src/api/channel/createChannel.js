// import axios from "axios";

// // Function to fetch channel data for React components
// export const createChannel = async ({
//   name,
//   about,
//   channelUserName,
//   CHANNEL_API_URL,
// }) => {
//   try {
//     // Fetch data from the backend API endpoint

//     const CREATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

//     const { data: channelData } = await axios.post(
//       `${CHANNEL_API_URL}${CREATE_CHANNEL_ENDPOINT}`,
//       {
//         name,
//         about,
//         channelUserName,
//       },
//       {
//         withCredentials: true, // ✅ this includes cookies/session info
//       }
//     );

//     console.log(`Channel Data: `, channelData);

//     return channelData;
//   } catch (error) {
//     console.error(
//       "CREATE CHANNEL error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// };

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
  name,
  about,
  channelUserName,
  CHANNEL_API_URL,
}) => {
  try {
    const CREATE_CHANNEL_ENDPOINT = "/api/v1/channels/channel-routes/";

    const payload = {
      name,
      about,
      channelUserName,
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
