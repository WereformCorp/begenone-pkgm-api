import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Deletes a channel by ID.
 */
export const deleteChannel = async ({
  channelId,
  CHANNEL_API_URL,
  DELETE_CHANNEL_ENDPOINT,
  limiterOptions = {},
}) => {
  const limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
    ...limiterOptions,
  });

  return limiter.schedule(async () => {
    try {
      const config = {
        withCredentials: true,
      };

      const { data: channelData } = await axios.delete(
        `${CHANNEL_API_URL}${DELETE_CHANNEL_ENDPOINT}${channelId}`,
        config,
      );

      console.log("Delete Channel | Response:", channelData);
      return channelData;
    } catch (error) {
      console.error(
        "DELETE CHANNEL Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
