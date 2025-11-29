import axios from "axios";

export async function emailVerify(token, AUTH_API_URL, email) {
  try {
    console.log(`Token from Verify Email: `, token);

    const res = await axios.patch(
      `${AUTH_API_URL}/api/v1/authentication/route-verification/verifyEmail`,
      {
        code: token, // 6-digit OTP
        email,
      }
    );

    console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", res.data);

    return res.data; // Expecting res.data.status, res.data.message, etc.
  } catch (err) {
    console.error("EMAIL VERIFY | API ERROR ⭕⭕⭕", err);
    throw err;
  }
}
