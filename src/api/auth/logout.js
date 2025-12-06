import axios from "axios";

export const logout = async AUTH_API_URL => {
  try {
    const LOGOUT_ENDPOINT = "/api/v1/authentication/route-logout/logout";

    const response = await axios.post(
      `${AUTH_API_URL}${LOGOUT_ENDPOINT}`,
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Logout response: ", response.data);

    return response.data;

    // if (response.data.status === "success") {
    //   // redirect after logout
    //   setTimeout(() => {
    //     window.location.href = "/";
    //   }, 2000);
    // }
  } catch (error) {
    console.error(
      "Login error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
