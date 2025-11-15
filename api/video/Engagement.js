import axios from "axios";

export const updateVideoInteraction = async (
  videoId,
  action,
  VIDEO_API_URL
) => {
  console.log(`Video ID: ${videoId}, Action: ${action}`);

  const response = await axios.patch(
    `${VIDEO_API_URL}/api/v1/videos/route-engagement/interaction/${videoId}/${action}`,
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
};
