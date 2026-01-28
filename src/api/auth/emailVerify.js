import axios from "axios";

/**
 * Verifies a user's email using OTP token.
 *
 * @param {string} token - 6-digit verification code
 * @param {string} AUTH_API_URL - Auth service base URL
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string} email - User email address
 * @returns {Promise<Object>} Verification API response
 */
export async function emailVerify({
  token,
  AUTH_API_URL,
  email,
  VERIFY_EMAIL_ENDPOINT,
}) {
  try {
    console.log("Verify Email Token:", token);

    const payload = {
      code: token, // 6-digit OTP
      email,
    };

    const response = await axios.patch(
      `${AUTH_API_URL}${VERIFY_EMAIL_ENDPOINT}`,
      payload,
    );

    console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Email Verify Error:",
      error?.response?.data || error?.message || error,
    );
    throw error;
  }
}
