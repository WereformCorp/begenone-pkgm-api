import axios from "axios";

export const login = async (email, password, AUTH_API_URL) => {
  try {
    const response = await axios.post(
      `${AUTH_API_URL}/api/v1/authentication/route-login/login`,
      {
        eAddress: { email, password },
      },
      {
        withCredentials: true,
      }
    );

    console.log(`Login Response: `, response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
