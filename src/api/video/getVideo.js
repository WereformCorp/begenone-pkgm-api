// import axios from "axios";
// import calculateTimeAgo from "../../utils/calculateTimeAgo";

// export const getVideo = async ({ ids, VIDEO_API_URL }) => {
//   try {
//     // Join the ids array into a string to pass as a query parameter
//     const queryParam = ids.join(",");

//     const GET_VIDEO_ENDPOINT = "/api/v1/videos/route-video/";

//     // Make the API call with the query parameter
//     const response = await axios.get(`${VIDEO_API_URL}${GET_VIDEO_ENDPOINT}`, {
//       params: {
//         ids: queryParam, // Sending the ids as a comma-separated string
//       },
//     });

//     console.log("Response from getVideos API:", response.data);

//     // Check if response is successful and has data
//     if (response.data.status === "Success") {
//       const videos = response.data.data.map(video => ({
//         ...video,
//         timeAgo: calculateTimeAgo(video.time),
//       }));

//       console.log(`Time Ago: `, videos);

//       return videos;
//     } else {
//       throw new Error("Failed to fetch videos.");
//     }
//   } catch (error) {
//     console.error(
//       "GET VIDEO Error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// };

import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

/**
 * Fetches one or more videos by ID list.
 *
 * @param {Object} params
 * @param {string[]} params.ids - Video IDs to fetch
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @returns {Promise<Object[]>} Processed video list
 */
export const getVideo = async ({ ids, VIDEO_API_URL }) => {
  try {
    const queryParam = ids.join(",");
    const GET_VIDEO_ENDPOINT = "/api/v1/videos/route-video/";

    const response = await axios.get(`${VIDEO_API_URL}${GET_VIDEO_ENDPOINT}`, {
      params: { ids: queryParam },
    });

    console.log("Response from getVideos API:", response.data);

    if (response.data.status === "Success") {
      const videos = response.data.data.map(video => ({
        ...video,
        timeAgo: calculateTimeAgo(video.time),
      }));

      console.log("Time Ago:", videos);
      return videos;
    } else {
      throw new Error("Failed to fetch videos.");
    }
  } catch (error) {
    console.error(
      "GET VIDEO Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
