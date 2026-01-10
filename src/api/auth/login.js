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
export const login = async ({
  email,
  password,
  AUTH_API_URL,
  LOGIN_ENDPOINT,
}) => {
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
      config
    );

    console.log("Login Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Login Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
