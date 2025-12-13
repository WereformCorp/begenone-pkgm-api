import axios from "axios";

/**
 * Logs a user out of the application.
 *
 * @param {string} AUTH_API_URL - Auth service base URL
 * @returns {Promise<Object>} Logout API response
 */
export const logout = async ({ AUTH_API_URL, LOGOUT_ENDPOINT }) => {
  try {
    // const LOGOUT_ENDPOINT = "/api/v1/authentication/route-logout/logout";

    const config = {
      withCredentials: true,
    };

    const response = await axios.post(
      `${AUTH_API_URL}${LOGOUT_ENDPOINT}`,
      {},
      config
    );

    console.log("Logout Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Logout Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
