import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";

export const getAllWires = async ({ WIRE_API_URL, CHANNEL_API_URL }) => {
  const [wiresRes, channelsRes] = await Promise.all([
    axios.get(`${WIRE_API_URL}/api/v1/wires/route-wires/`),
    axios.get(`${CHANNEL_API_URL}/api/v1/channels/channel-routes/`),
  ]);

  const channels = channelsRes.data.data;

  const channelLogoMap = new Map(
    channels.map(channel => [
      channel._id,
      channel.channelLogo ? `${cloudFrontDomain}/${channel.channelLogo}` : null,
    ])
  );

  console.log(`GET ALL WIRES FROM API PACKAGE: `, wires);

  const wires = wiresRes.data.data.map(wire => ({
    ...wire,
    timeAgo: calculateTimeAgo(wire.time),
  }));

  console.log(`WIRES FROM API PACKAGE`, wires);

  return {
    wires,
    channelLogos: Object.fromEntries(channelLogoMap),
  };
};
