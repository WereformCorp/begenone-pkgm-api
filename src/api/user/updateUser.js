import axios from "axios";
import Bottleneck from "bottleneck";

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
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string} params.id - User ID to update
 * @param {Object} params.dataObj - Fields to update on the user
 *
 * @returns {Promise<Object>} Updated user data returned by the API
 *
 * @throws Will throw if the API request fails
 */
/**
 * Update an existing user's data.
 */
export async function updateUser({
  USER_API_ENDPOINT,
  id,
  dataObj,
  UPDATE_USER_ENDPOINT,
  limiterOptions = {},
}) {
  const limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
    ...limiterOptions,
  });

  return limiter.schedule(async () => {
    try {
      const url = `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`;

      console.log("Update User API URL:", url);

      const response = await axios.patch(url, dataObj);

      console.log("Update User API response:", response.data);
      return response.data;
    } catch (err) {
      console.log("Error from updateUser API:", err);
      throw err;
    }
  });
}
