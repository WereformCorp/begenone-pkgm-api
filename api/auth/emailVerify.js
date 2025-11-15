import axios from "axios";

export const verifyEmail = async (token, AUTH_API_URL) => {
  try {
    const res = await axios.patch(
      `${AUTH_API_URL}/api/v1/authentication/route-verification/verifyEmail/${token}`
    );

    console.log("EMAIL VERIFY | API RESPONSE ✅✅✅", res.data);

    return res.data; // Expecting res.data.status, res.data.message, etc.
  } catch (err) {
    console.error("EMAIL VERIFY | API ERROR ⭕⭕⭕", err);
    throw err;
  }
};
