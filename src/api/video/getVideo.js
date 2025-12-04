import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

export const getVideo = async ({ ids, VIDEO_API_URL }) => {
  try {
    // Join the ids array into a string to pass as a query parameter
    const queryParam = ids.join(",");

    // Make the API call with the query parameter
    const response = await axios.get(
      `${VIDEO_API_URL}/api/v1/videos/route-video/`,
      {
        params: {
          ids: queryParam, // Sending the ids as a comma-separated string
        },
      }
    );

    console.log("Response from getVideos API:", response.data);

    // Check if response is successful and has data
    // if (response.data.status === "Success") {
    //   return response.data.data; // Return the videos data
    // } else {
    //   throw new Error("Failed to fetch videos.");
    // }

    if (response.data.status === "Success") {
      const videos = response.data.data.map(video => ({
        ...video,
        timeAgo: calculateTimeAgo(video.time),
      }));

      console.log(`Time Ago: `, videos);

      return videos;
    } else {
      throw new Error("Failed to fetch videos.");
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error; // You can handle this error as needed in the frontend
  }
};
