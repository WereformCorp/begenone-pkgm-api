import axios from "axios";

/**
 * Fetches the authenticated user's profile using a JWT token.
 *
 * @param {string} USER_API_URL - User service base URL
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string|null} token - Bearer authentication token
 * @returns {Promise<Object|null>} User data or null if no token is provided
 */
export const getMe = async ({ USER_API_URL, token, GET_ME_ENDPOINT }) => {
  // Guard: No token means no authenticated session
  if (!token) {
    console.log("getMe: No stored session token");
    return null;
  }

  try {
    const response = await axios.get(`${USER_API_URL}${GET_ME_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Successful user fetch
    return response.data;
  } catch (error) {
    console.error(
      "GET ME Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
