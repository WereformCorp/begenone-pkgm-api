// import axios from "axios";
// import calculateTimeAgo from "../../utils/calculateTimeAgo";

// const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";

// export const getAllWires = async ({
//   WIRE_API_URL,
//   CHANNEL_API_URL,
//   page = 1,
//   limit = 10,
// }) => {
//   console.info(`Request Reaching Get All Wires in the API Package!`);
//   console.info(`WIRE API URL from API Package: `, WIRE_API_URL);
//   console.info(`CHANNEL API URL from API Package: `, CHANNEL_API_URL);

//   // Send pagination query params to backend
//   const wiresRes = await axios.get(`${WIRE_API_URL}/api/v1/wires/route-wires`, {
//     params: { page, limit },
//   });

//   console.info(`Wires Response from Get All Wires: `, wiresRes);

//   const channelsRes = await axios.get(
//     `${CHANNEL_API_URL}/api/v1/channels/channel-routes/`
//   );

//   const channels = channelsRes.data.data;

//   const channelLogoMap = new Map(
//     channels.map(channel => [
//       channel._id,
//       channel.channelLogo ? `${cloudFrontDomain}/${channel.channelLogo}` : null,
//     ])
//   );

//   // Backend returns wires inside wiresRes.data.data
//   const rawWires = wiresRes.data.data;

//   const wires = rawWires.map(wire => ({
//     ...wire,
//     timeAgo: calculateTimeAgo(wire.time),
//   }));

//   return {
//     // for frontend list
//     data: wires,

//     // from backend meta
//     meta: wiresRes.data.meta,

//     // all channel logos
//     channelLogos: Object.fromEntries(channelLogoMap),
//   };
// };

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
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=10] - Items per page
 *
 * @returns {Promise<Object>} Wires list, pagination meta, and channel logos
 */
export const getAllWires = async ({
  WIRE_API_URL,
  CHANNEL_API_URL,
  page = 1,
  limit = 10,
  GET_ALL_WIRES_ENDPOINT_URL,
}) => {
  console.info("GetAllWires | Request started");
  console.info("WIRE_API_URL:", WIRE_API_URL);
  console.info("CHANNEL_API_URL:", CHANNEL_API_URL);

  // const GET_ALL_WIRES_ENDPOINT_URL = 'api/v1/wires/route-wires';

  // Fetch paginated wires
  const wiresRes = await axios.get(
    `${WIRE_API_URL}/${GET_ALL_WIRES_ENDPOINT_URL}`,
    {
      params: { page, limit },
    }
  );

  console.info("GetAllWires | Wires response:", wiresRes);

  // Fetch channels for logo mapping
  const channelsRes = await axios.get(
    `${CHANNEL_API_URL}/api/v1/channels/channel-routes/`
  );

  const channels = channelsRes.data.data;

  const channelLogoMap = new Map(
    channels.map(channel => [
      channel._id,
      channel.channelLogo ? `${cloudFrontDomain}/${channel.channelLogo}` : null,
    ])
  );

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
    channelLogos: Object.fromEntries(channelLogoMap),
  };
};
