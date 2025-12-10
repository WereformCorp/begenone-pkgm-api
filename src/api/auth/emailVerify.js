// import axios from "axios";

// export async function emailVerify(token, AUTH_API_URL, email) {
//   try {
//     console.log(`Token from Verify Email: `, token);

//     const VERIFY_EMAIL =
//       "/api/v1/authentication/route-verification/verifyEmail";

//     const res = await axios.patch(`${AUTH_API_URL}${VERIFY_EMAIL}`, {
//       code: token, // 6-digit OTP
//       email,
//     });

//     console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", res.data);

//     return res.data; // Expecting res.data.status, res.data.message, etc.
//   } catch (error) {
//     console.error(
//       "Login error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// }

import axios from "axios";

/**
 * Verifies a user's email using OTP token.
 *
 * @param {string} token - 6-digit verification code
 * @param {string} AUTH_API_URL - Auth service base URL
 * @param {string} email - User email address
 * @returns {Promise<Object>} Verification API response
 */
export async function emailVerify(token, AUTH_API_URL, email) {
  try {
    console.log("Verify Email Token:", token);

    const VERIFY_EMAIL_ENDPOINT =
      "/api/v1/authentication/route-verification/verifyEmail";

    const payload = {
      code: token, // 6-digit OTP
      email,
    };

    const response = await axios.patch(
      `${AUTH_API_URL}${VERIFY_EMAIL_ENDPOINT}`,
      payload
    );

    console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Email Verify Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
}
