import axios from "axios";

export const updateVideoInteraction = async (
  videoId,
  action,
  VIDEO_API_URL
) => {
  console.log(`Video ID: ${videoId}, Action: ${action}`);

  try {
    const UPDATE_VIDEO_INTERACTION_ENDPOINT =
      "/api/v1/videos/route-engagement/interaction/";

    const response = await axios.patch(
      `${VIDEO_API_URL}${UPDATE_VIDEO_INTERACTION_ENDPOINT}${videoId}/${action}`,
      {}, // no body needed
      {
        withCredentials: true, // important: send cookies
      }
    );

    console.log(`Response from Engagement API: `, response.data);

    return {
      likes: response.data.likes,
      dislikes: response.data.dislikes,
    };
  } catch (error) {
    console.error(
      "ENGAGEMENT error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
