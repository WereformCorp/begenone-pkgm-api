import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Logs a user out of the application.
 *
 * @param {string} AUTH_API_URL - Auth service base URL
 * @param {string} LOGOUT_ENDPOINT - Logout endpoint
 * @param {Object} limiterOptions - Optional Bottleneck configuration
 *
 * @example
 * limiterOptions: {
 *   minTime: 200,
 *   maxConcurrent: 1
 * }
 *
 * @returns {Promise<Object>} Logout API response
 */
export const logout = async ({
  AUTH_API_URL,
  LOGOUT_ENDPOINT,
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

      const response = await axios.post(
        `${AUTH_API_URL}${LOGOUT_ENDPOINT}`,
        {},
        config,
      );

      console.log("Logout Response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Logout Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
