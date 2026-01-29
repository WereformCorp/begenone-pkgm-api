import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Logs a user in using email and password.
 *
 * @param {string} email - User email address
 * @param {string} password - User password
 * @param {string} AUTH_API_URL - Auth service base URL
 * @param {string} LOGIN_ENDPOINT - Login endpoint
 * @param {Object} limiterOptions - Optional Bottleneck configuration
 *
 * @example
 * limiterOptions: {
 *   minTime: 200,
 *   maxConcurrent: 1
 * }
 *
 * @returns {Promise<Object>} Login API response
 */

export const login = async ({
  email,
  password,
  AUTH_API_URL,
  LOGIN_ENDPOINT,
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
        eAddress: { email, password },
      };

      const config = {
        withCredentials: true,
      };

      const response = await axios.post(
        `${AUTH_API_URL}${LOGIN_ENDPOINT}`,
        payload,
        config,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  });
};
