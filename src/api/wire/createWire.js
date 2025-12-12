// import axios from "axios";

// export async function createWire({ WIRE_API_URL, wireText, heading, token }) {
//   try {
//     const url = `${WIRE_API_URL}/api/v1/wires/route-wires/`;
//     console.log("CREATE WIRE URL ===>", url);

//     console.log("Token in createWire ===>", token);
//     const response = await axios.post(
//       url,
//       { wireText, heading },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     console.log("Response from createWire API:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error creating wire:", error);
//   }
// }

import axios from "axios";

/**
 * Create a new wire post.
 *
 * Sends an authenticated POST request to the Wire API.
 *
 * @async
 * @param {Object} params
 * @param {string} params.WIRE_API_URL - Base URL of the Wire API
 * @param {string} params.wireText - Main text content of the wire
 * @param {string} params.heading - Optional heading/title for the wire
 * @param {string} params.token - Bearer token for authentication
 *
 * @returns {Promise<Object>} Created wire data returned by the API
 */
export async function createWire({ WIRE_API_URL, wireText, heading, token }) {
  try {
    const url = `${WIRE_API_URL}/api/v1/wires/route-wires/`;

    console.log("Create Wire API URL:", url);
    console.log("Auth token provided:", Boolean(token));

    const response = await axios.post(
      url,
      { wireText, heading },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Create Wire API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating wire:", error);
    throw error;
  }
}
