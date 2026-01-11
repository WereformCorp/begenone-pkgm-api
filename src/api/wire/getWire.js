import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

/**
 * Fetch a single wire by ID.
 *
 * Adds relative time (`timeAgo`) to the wire data.
 *
 * @async
 * @param {Object} params
 * @param {string} params.id - Wire ID
 * @param {string} params.WIRE_API_URL - Base URL of the Wire API
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object[]>} Wire data with enriched time metadata
 */
export const getWire = async ({ id, WIRE_API_URL, GETWIRE_ENDPOINT_URL }) => {
  try {

    const url = `${WIRE_API_URL}/${GETWIRE_ENDPOINT_URL}${id}`;
    console.log("Get Wire API URL:", url);

    const response = await axios.get(url);

    console.log("Get Wire API response:", response.data);

    if (response.data.status !== "success") {
      throw new Error("Failed to fetch wire.");
    }

    const raw = response.data.data;

    // Normalize to array no matter what
    const wires = Array.isArray(raw) ? raw : [raw];

    const enrichedWires = wires.map(wire => ({
      ...wire,
      timeAgo: calculateTimeAgo(wire.time),
    }));

    console.log("GetWire | Enriched wires:", enrichedWires);
    return enrichedWires;
  } catch (error) {
    console.error("Error fetching wire:", error);
    throw error;
  }
};
