import axios from "axios";

export const login = async (email, password, AUTH_API_URL) => {
  try {
    const LOGIN_ENDPOINT = "/api/v1/authentication/route-login/login";

    const response = await axios.post(
      `${AUTH_API_URL}${LOGIN_ENDPOINT}`,
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
    console.error(
      "Login error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
