import axios from "axios";

export async function emailVerify(token, AUTH_API_URL, email) {
  try {
    console.log(`Token from Verify Email: `, token);

    const VERIFY_EMAIL =
      "/api/v1/authentication/route-verification/verifyEmail";

    const res = await axios.patch(`${AUTH_API_URL}${VERIFY_EMAIL}`, {
      code: token, // 6-digit OTP
      email,
    });

    console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", res.data);

    return res.data; // Expecting res.data.status, res.data.message, etc.
  } catch (error) {
    console.error(
      "Login error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
}
