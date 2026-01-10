import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

/**
 * Fetches an overview of videos and channels for the home feed.
 * Enriches videos with thumbnails, channel logos, and time-ago metadata.
 *
 * @param {Object} params
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object>} Overview feed data
 */
export const getOverview = async ({
  VIDEO_API_URL,
  CHANNEL_API_URL,
  GET_ALL_VIDEOS_ENDPOINT,
  GET_ALL_CHANNELS_ENDPOINT,
  CLOUDFRONTDOMAIN,
  S3BUCKETDOMAIN,
}) => {
  try {
    const [videosRes, channelsRes] = await Promise.all([
      axios.get(`${VIDEO_API_URL}${GET_ALL_VIDEOS_ENDPOINT}`),
      axios.get(`${CHANNEL_API_URL}${GET_ALL_CHANNELS_ENDPOINT}`),
    ]);

    const videos = videosRes.data.data;
    const channels = channelsRes.data.data;

    // Create thumbnail and channel logo maps
    const thumbnailMap = new Map(
      videos.map(item => [
        item.thumbnail,
        `${CLOUDFRONTDOMAIN}/${item.thumbnail}`,
      ])
    );

    const channelLogoMap = new Map(
      channels.map(channel => [
        channel._id,
        channel.channelLogo
          ? `${CLOUDFRONTDOMAIN}/${channel.channelLogo}`
          : null,
      ])
    );

    const filteredVideos = videos.filter(video => video.channel);

    const enrichedVideos = filteredVideos.map(video => {
      video.videoTimeAgo = calculateTimeAgo(video.time);

      video.thumbUrl =
        !video.thumbnail ||
        ["default-thumbnail.jpeg", "default-thumbnail.png"].includes(
          video.thumbnail
        )
          ? `${S3BUCKETDOMAIN}/default-thumbnail.png`
          : thumbnailMap.get(video.thumbnail) || null;

      const channelId = video.channel._id || video.channel;
      const logoUrl = channelLogoMap.get(channelId) || null;

      video.channelLogo = logoUrl;
      if (video.channel && typeof video.channel === "object") {
        video.channel.channelLogo = logoUrl;
      }

      return video;
    });

    // Shuffle and limit results
    const shuffled = enrichedVideos.sort(() => 0.5 - Math.random());
    const limitedVideos = shuffled.slice(0, 21);

    // Featured video logic
    const featuredVideoId = "673f74ba66154c6994b9460f";
    const featuredVideo = limitedVideos.find(v => v._id === featuredVideoId);
    const restVideos = limitedVideos.filter(v => v._id !== featuredVideoId);
    const sortedVideos = featuredVideo
      ? [featuredVideo, ...restVideos]
      : restVideos;

    return {
      data: {
        videos: sortedVideos,
        channelLogos: Object.fromEntries(channelLogoMap),
      },
    };
  } catch (error) {
    console.error(
      "Get Overview Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
