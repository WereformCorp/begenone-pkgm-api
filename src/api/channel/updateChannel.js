import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Updates an existing channel's core information.
 */
export const updateChannel = async ({
  channelId,
  name,
  about,
  channelUserName,
  CHANNEL_API_URL,
  UPDATE_CHANNEL_ENDPOINT,
  limiterOptions = {},
}) => {
  const limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
    ...limiterOptions,
  });

  return limiter.schedule(async () => {
    try {
      const payload = {
        name,
        about,
        channelUserName,
      };

      const config = {
        withCredentials: true,
      };

      const { data: channelData } = await axios.patch(
        `${CHANNEL_API_URL}${UPDATE_CHANNEL_ENDPOINT}${channelId}`,
        payload,
        config,
      );

      console.log("Update Channel | Response:", channelData);
      return channelData;
    } catch (error) {
      console.error(
        "UPDATE CHANNEL Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
