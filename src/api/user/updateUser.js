// import axios from "axios";

// export async function updateUser({ USER_API_ENDPOINT, id, dataObj }) {
//   try {
//     const UPDATE_USER_ENDPOINT = `/api/v1/users/user/`;

//     console.log(
//       `ENDPOINT: `,
//       `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`
//     );

//     const response = await axios.patch(
//       `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`,

//       dataObj
//     );

//     if (response) {
//       console.log(`Data from Update User ——— Package API:`, response.data);
//       const userData = response.data;

//       return userData;
//     }
//   } catch (err) {
//     console.log(`Error from Update User: `, err);
//     throw err;
//   }
// }

import axios from "axios";

/**
 * Update an existing user's data.
 *
 * Sends a PATCH request to the backend user service.
 * This function does not perform validation and assumes
 * the caller provides valid update fields.
 *
 * @async
 * @function updateUser
 *
 * @param {Object} params
 * @param {string} params.USER_API_ENDPOINT - Base URL of the User API
 * @param {string} params.id - User ID to update
 * @param {Object} params.dataObj - Fields to update on the user
 *
 * @returns {Promise<Object>} Updated user data returned by the API
 *
 * @throws Will throw if the API request fails
 */
export async function updateUser({ USER_API_ENDPOINT, id, dataObj }) {
  try {
    const UPDATE_USER_ENDPOINT = "/api/v1/users/user/";
    const url = `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`;

    // Log the final endpoint for debugging
    console.log("Update User API URL:", url);

    // Send update payload to backend
    const response = await axios.patch(url, dataObj);

    // Backend returns updated user data
    console.log("Update User API response:", response.data);

    return response.data;
  } catch (err) {
    console.log("Error from updateUser API:", err);
    throw err;
  }
}
