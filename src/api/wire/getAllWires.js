import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";

export const getAllWires = async ({
  WIRE_API_URL,
  CHANNEL_API_URL,
  page = 1,
  limit = 10,
}) => {
  console.info(`Request Reaching Get All Wires in the API Package!`);
  console.info(`WIRE API URL from API Package: `, WIRE_API_URL);
  console.info(`CHANNEL API URL from API Package: `, CHANNEL_API_URL);

  // Send pagination query params to backend
  const wiresRes = await axios.get(`${WIRE_API_URL}/api/v1/wires/route-wires`, {
    params: { page, limit },
  });

  console.info(`Wires Response from Get All Wires: `, wiresRes);

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

  // Backend returns wires inside wiresRes.data.data
  const rawWires = wiresRes.data.data;

  const wires = rawWires.map(wire => ({
    ...wire,
    timeAgo: calculateTimeAgo(wire.time),
  }));

  return {
    // for frontend list
    data: wires,

    // from backend meta
    meta: wiresRes.data.meta,

    // all channel logos
    channelLogos: Object.fromEntries(channelLogoMap),
  };
};
