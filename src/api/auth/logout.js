// import axios from "axios";

// export const logout = async AUTH_API_URL => {
//   try {
//     const LOGOUT_ENDPOINT = "/api/v1/authentication/route-logout/logout";

//     const response = await axios.post(
//       `${AUTH_API_URL}${LOGOUT_ENDPOINT}`,
//       {},
//       {
//         withCredentials: true,
//       }
//     );

//     console.log("Logout response: ", response.data);

//     return response.data;

//     // if (response.data.status === "success") {
//     //   // redirect after logout
//     //   setTimeout(() => {
//     //     window.location.href = "/";
//     //   }, 2000);
//     // }
//   } catch (error) {
//     console.error(
//       "Login error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// };

import axios from "axios";

/**
 * Logs a user out of the application.
 *
 * @param {string} AUTH_API_URL - Auth service base URL
 * @returns {Promise<Object>} Logout API response
 */
export const logout = async AUTH_API_URL => {
  try {
    const LOGOUT_ENDPOINT = "/api/v1/authentication/route-logout/logout";

    const config = {
      withCredentials: true,
    };

    const response = await axios.post(
      `${AUTH_API_URL}${LOGOUT_ENDPOINT}`,
      {},
      config
    );

    console.log("Logout Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Logout Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
