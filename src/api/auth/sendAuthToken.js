import axios from "axios";

/**
 * Sends an authentication token (OTP) to a user's email.
 *
 * @param {string} AUTH_API_URL - Auth service base URL
 *
 * @example
 * URL must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string} email - User email address
 * @param {string} SEND_AUTH_TOKEN_ENDPOINT - Signup auth endpoint path
 * @returns {Promise<Object>} Send token API response
 */
export async function sendAuthToken({
  USER_API_URL,
  email,
  SEND_AUTH_TOKEN_ENDPOINT,
}) {
  try {
    console.log("Send Auth Token | Email:", email);
    console.log("Send Auth Token | Endpoint:", SEND_AUTH_TOKEN_ENDPOINT);
    console.log(
      "Send Auth Token | URL:",
      `${USER_API_URL}${SEND_AUTH_TOKEN_ENDPOINT}`,
    );

    const payload = {
      email,
    };

    const response = await axios.post(
      `${USER_API_URL}${SEND_AUTH_TOKEN_ENDPOINT}`,
      payload,
    );

    console.log("SEND AUTH TOKEN | API RESPONSE ✅✅✅", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Send Auth Token Error:",
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
}
