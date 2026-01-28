import axios from "axios";

/**
 * Logs a user in using email and password.
 *
 * @param {string} email - User email address
 * @param {string} password - User password
 * @param {string} AUTH_API_URL - Auth service base URL
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object>} Login API response
 */

import Bottleneck from "bottleneck";

const limiter = new Bottleneck({
  minTime: 200, // at most 1 request every 200ms (5/sec)
  maxConcurrent: 1, // only one login request at a time
});

export const login = async ({
  email,
  password,
  AUTH_API_URL,
  LOGIN_ENDPOINT,
}) => {
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
