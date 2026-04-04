import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";

/**
 * Fetch a paginated list of wires with enriched metadata.
 *
 * - Applies page-based pagination
 * - Adds relative time (`timeAgo`)
 * - Builds channel logo map for UI consumption
 *
 * @async
 * @param {Object} params
 * @param {string} params.WIRE_API_URL - Base URL of the Wire API
 * @param {string} params.CHANNEL_API_URL - Base URL of the Channel API
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 * @param {string} [params.channel] - Optional channel id (Mongo) — same as wire service `?channel=`
 *
 * @returns {Promise<Object>} Wires list, pagination meta, and channel logos
 */
export const getAllWires = async ({
  WIRE_API_URL,
  CHANNEL_API_URL,
  page = 1,
  limit = 10,
  channel,
  GET_ALL_WIRES_ENDPOINT_URL,
  CHANNEL_API_ENDPOINT,
}) => {
  try {
    console.info("GetAllWires | Request started");
    console.info("WIRE_API_URL:", WIRE_API_URL);
    console.info("CHANNEL_API_URL:", CHANNEL_API_URL);

    const params = { page, limit };
    if (channel != null && String(channel).trim() !== "") {
      params.channel = String(channel);
    }

    // Fetch paginated wires
    const wiresRes = await axios.get(
      `${WIRE_API_URL}/${GET_ALL_WIRES_ENDPOINT_URL}`,
      {
        params,
      },
    );

    //

    console.info("GetAllWires | Wires response:", wiresRes);

    let channelLogos = {};

    // Listing all channels is heavy; skip when filtering by one channel (e.g. channel page tab).
    if (
      !params.channel &&
      CHANNEL_API_URL &&
      CHANNEL_API_ENDPOINT
    ) {
      const channelsRes = await axios.get(
        `${CHANNEL_API_URL}${CHANNEL_API_ENDPOINT}`,
      );

      const channels = channelsRes.data.data;

      const channelLogoMap = new Map(
        channels.map(ch => [
          ch._id,
          ch.channelLogo
            ? `${cloudFrontDomain}/${ch.channelLogo}`
            : null,
        ]),
      );

      channelLogos = Object.fromEntries(channelLogoMap);
    }

    // Backend returns wires under wiresRes.data.data
    const rawWires = wiresRes.data.data;

    // Enrich wires with relative time
    const wires = rawWires.map(wire => ({
      ...wire,
      timeAgo: calculateTimeAgo(wire.time),
    }));

    return {
      data: wires,
      meta: wiresRes.data.meta,
      channelLogos,
    };
  } catch (error) {
    console.error("Error in getAllWires:", error);
    throw error;
  }
};
