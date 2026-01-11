import axios from "axios";

/**
 * Delete a wire by its ID.
 *
 * This function sends an authenticated DELETE request to the Wire service
 * to remove a wire permanently.
 *
 * @param {Object} params
 * @param {string} params.WIRE_API_URL - Base URL of the Wire API service
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string} params.id - Unique ID of the wire to be deleted
 * @param {string} params.token - Bearer token used for authentication
 *
 * @returns {Promise<Object|boolean>}
 * Returns the API response data if available, otherwise `true`
 */
export async function deleteWire({
  WIRE_API_URL,
  id,
  token,
  DELETE_WIRE_ENDPOINT,
}) {
  // Token is required for authenticated wire deletion
  console.log(`Token from Actual Request making Delete Wire: `, token);

  // Construct and send DELETE request to backend
  const response = await axios.delete(
    `${WIRE_API_URL}/${DELETE_WIRE_ENDPOINT}${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Log backend response for debugging and validation
  console.log(`Response from Delete Wire API: `, response.data);

  // Return backend response or fallback to true if no body is returned
  return response.data || true;
}
