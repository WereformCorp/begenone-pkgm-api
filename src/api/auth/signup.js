import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Registers a new user after validating uniqueness.
 *
 * @param {Object} params - Signup request payload
 * @param {string} params.firstName
 * @param {string} params.secondName
 * @param {string} params.email
 * @param {string} params.password
 * @param {string} params.passwordConfirm
 * @param {string} params.username
 * @param {string} params.USER_API_URL
 * @param {string} params.USER_CHECK_EXISTENCE_ENDPOINT
 * @param {string} params.CREATE_USER_ENDPOINT
 * @param {Object} params.limiterOptions - Optional Bottleneck configuration
 *
 * @returns {Promise<Object>} Signup API response
 */
export const signup = async ({
  firstName,
  secondName,
  email,
  password,
  passwordConfirm,
  username,
  USER_API_URL,
  USER_CHECK_EXISTENCE_ENDPOINT,
  CREATE_USER_ENDPOINT,
  limiterOptions = {},
}) => {
  const limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
    ...limiterOptions,
  });

  return limiter.schedule(async () => {
    try {
      if (password !== passwordConfirm) {
        throw new Error("Passwords do not match");
      }

      // Step 1: Check if username or email already exists
      const existenceCheckRes = await axios.post(
        `${USER_API_URL}${USER_CHECK_EXISTENCE_ENDPOINT}`,
        {
          username,
          email,
        },
      );

      const message = existenceCheckRes.data.message;

      if (message === "username-exist") {
        throw new Error("Username already exists");
      }

      if (message === "email-exist") {
        throw new Error("Email already exists");
      }

      // Step 2: Final signup request
      const payload = {
        name: { firstName, secondName },
        username,
        eAddress: {
          email,
          password,
          passwordConfirm,
          passwordChangedAt: Date.now(),
        },
      };

      const response = await axios.post(
        `${USER_API_URL}/${CREATE_USER_ENDPOINT}`,
        payload,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Signup Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
