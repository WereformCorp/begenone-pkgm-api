// import axios from "axios";

// import { useQuery } from "@tanstack/react-query";
// import { useDispatch } from "react-redux";
// import { setMe } from "../../store/userSlice";

// export const getMe = async (USER_API_URL, token) => {
//   // const token = await getToken("user_session");

//   if (!token) {
//     console.log("No stored session token");
//     return null;
//   }

//   const GET_ME_ENDPOINT = "/api/v1/users/me/";

//   try {
//     const response = await axios.get(`${USER_API_URL}${GET_ME_ENDPOINT}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     // console.log("GET ME Success:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "GET ME error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// };

import axios from "axios";

/**
 * Fetches the authenticated user's profile using a JWT token.
 *
 * @param {string} USER_API_URL - User service base URL
 * @param {string|null} token - Bearer authentication token
 * @returns {Promise<Object|null>} User data or null if no token is provided
 */
export const getMe = async (USER_API_URL, token) => {
  // Guard: No token means no authenticated session
  if (!token) {
    console.log("getMe: No stored session token");
    return null;
  }

  const GET_ME_ENDPOINT = "/api/v1/users/me/";

  try {
    const response = await axios.get(`${USER_API_URL}${GET_ME_ENDPOINT}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Successful user fetch
    return response.data;
  } catch (error) {
    console.error(
      "GET ME Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
