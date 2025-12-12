import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

// export const getWire = async ({ id, WIRE_API_URL }) => {
//   try {
//     // Join the ids array into a string to pass as a query parameter
//     // const queryParam = ids.length > 1 ?? ids.join(",");

//     // Make the API call with the query parameter
//     const response = await axios.get(
//       `${WIRE_API_URL}/api/v1/wires/route-wires/${id}`
//     );

//     console.log("Response from getVideos API:", response.data);

//     // Check if response is successful and has data
//     if (response.data.status === "Success") {
//       return response.data.data; // Return the videos data
//     } else {
//       throw new Error("Failed to fetch videos.");
//     }
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     throw error; // You can handle this error as needed in the frontend
//   }
// };

// export const getWire = async ({ id, WIRE_API_URL }) => {
//   try {
//     const url = `${WIRE_API_URL}/api/v1/wires/route-wires/${id}`;
//     console.log("GET WIRE URL ===>", url);

//     const response = await axios.get(url);

//     console.log("Response from getWire API:", response.data);

//     if (response.data.status === "success") {
//       const wires = response.data.data.map(wire => ({
//         ...wire,
//         timeAgo: calculateTimeAgo(wire.time),
//       }));

//       console.log(`Time Ago: `, wires);

//       return wires;
//     } else {
//       throw new Error("Failed to fetch videos.");
//     }

//     // Note: status is "success" (lowercase)
//     // if (response.data.status === "success") {
//     //   return response.data.data;
//     // } else {
//     //   throw new Error("Failed to fetch wire.");
//     // }
//   } catch (error) {
//     console.error("Error fetching wire:", error);
//     throw error;
//   }
// };

/**
 * Fetch a single wire by ID.
 *
 * Adds relative time (`timeAgo`) to the wire data.
 *
 * @async
 * @param {Object} params
 * @param {string} params.id - Wire ID
 * @param {string} params.WIRE_API_URL - Base URL of the Wire API
 *
 * @returns {Promise<Object[]>} Wire data with enriched time metadata
 */
export const getWire = async ({ id, WIRE_API_URL }) => {
  try {
    const url = `${WIRE_API_URL}/api/v1/wires/route-wires/${id}`;
    console.log("Get Wire API URL:", url);

    const response = await axios.get(url);

    console.log("Get Wire API response:", response.data);

    if (response.data.status === "success") {
      const wires = response.data.data.map(wire => ({
        ...wire,
        timeAgo: calculateTimeAgo(wire.time),
      }));

      console.log("GetWire | Enriched wires:", wires);
      return wires;
    }

    throw new Error("Failed to fetch wire.");
  } catch (error) {
    console.error("Error fetching wire:", error);
    throw error;
  }
};
