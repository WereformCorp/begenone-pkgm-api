import axios from "axios";

export const logout = async AUTH_API_URL => {
  try {
    const response = await axios.post(
      `${AUTH_API_URL}/api/v1/authentication/route-logout/logout`,
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
  } catch (err) {
    console.error(err?.response || err);
  }
};
