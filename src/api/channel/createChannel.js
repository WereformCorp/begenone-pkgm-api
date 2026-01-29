import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Creates a new channel for the authenticated user.
 */
export const createChannel = async ({
  NAME,
  ABOUT,
  CHANNEL_USERNAME,
  CHANNEL_API_URL,
  CREATE_CHANNEL_ENDPOINT,
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
        name: NAME,
        about: ABOUT,
        channelUserName: CHANNEL_USERNAME,
      };

      const config = {
        withCredentials: true,
      };

      const { data: channelData } = await axios.post(
        `${CHANNEL_API_URL}${CREATE_CHANNEL_ENDPOINT}`,
        payload,
        config,
      );

      console.log("Create Channel | Response:", channelData);
      return channelData;
    } catch (error) {
      console.error(
        "CREATE CHANNEL Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
