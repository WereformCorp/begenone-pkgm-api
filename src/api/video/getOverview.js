// import axios from "axios";
// import calculateTimeAgo from "../../utils/calculateTimeAgo";

// const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";
// const s3BucketDomain = "https://begenone-images.s3.us-east-1.amazonaws.com";

// export const getOverview = async ({ VIDEO_API_URL, CHANNEL_API_URL }) => {
//   try {
//     const GET_ALL_VIDEOS_ENDPOINT = "/api/v1/videos/route-video/";
//     const GET_ALL_CHANNELS_ENDPOINT = "/api/v1/channels/channel-routes/";

//     const [videosRes, channelsRes] = await Promise.all([
//       axios.get(`${VIDEO_API_URL}${GET_ALL_VIDEOS_ENDPOINT}`),
//       axios.get(`${CHANNEL_API_URL}${GET_ALL_CHANNELS_ENDPOINT}`),
//       // axios.get(`${urlPath}/api/v1/route-video/thumbnail`),
//     ]);

//     // console.log(`Video Response: `, videosRes);
//     // console.log(`Channel Response: `, channelsRes);

//     const videos = videosRes.data.data;
//     const channels = channelsRes.data.data;
//     // const thumbnails = videosRes.data.data || [];

//     // Create Maps
//     const thumbnailMap = new Map(
//       videos.map(item => [
//         item.thumbnail,
//         `${cloudFrontDomain}/${item.thumbnail}`,
//       ])
//     );

//     // console.log(`Thumbnail Response: `, thumbnailMap);

//     const channelLogoMap = new Map(
//       channels.map(channel => [
//         channel._id,
//         channel.channelLogo
//           ? `${cloudFrontDomain}/${channel.channelLogo}`
//           : null,
//       ])
//     );

//     const filteredVideos = videos.filter(video => video.channel);
//     const enrichedVideos = filteredVideos.map(video => {
//       video.videoTimeAgo = calculateTimeAgo(video.time);

//       video.thumbUrl =
//         !video.thumbnail ||
//         ["default-thumbnail.jpeg", "default-thumbnail.png"].includes(
//           video.thumbnail
//         )
//           ? `${s3BucketDomain}/default-thumbnail.png`
//           : thumbnailMap.get(video.thumbnail) || null;

//       const channelId = video.channel._id || video.channel;
//       const logoUrl = channelLogoMap.get(channelId) || null;

//       video.channelLogo = logoUrl;
//       if (video.channel && typeof video.channel === "object") {
//         video.channel.channelLogo = logoUrl;
//       }

//       return video;
//     });

//     // Shuffle and limit
//     const shuffled = enrichedVideos.sort(() => 0.5 - Math.random());
//     const limitedVideos = shuffled.slice(0, 21);

//     // Feature logic
//     const featuredVideoId = "673f74ba66154c6994b9460f";
//     const featuredVideo = limitedVideos.find(v => v._id === featuredVideoId);
//     const restVideos = limitedVideos.filter(v => v._id !== featuredVideoId);
//     const sortedVideos = featuredVideo
//       ? [featuredVideo, ...restVideos]
//       : restVideos;

//     // console.log(`FEATURED VIDEO:`, featuredVideoId);
//     // console.log(`Videos:`, sortedVideos);
//     // console.log(`Channel Logos:`, channelLogoMap);

//     return {
//       data: {
//         videos: sortedVideos,
//         // thumbnails,
//         channelLogos: Object.fromEntries(channelLogoMap),
//       },
//     };
//   } catch (error) {
//     console.error(
//       "Get Overview Error:",
//       error?.response?.data || error?.message || error
//     );
//     throw error;
//   }
// };

import axios from "axios";
import calculateTimeAgo from "../../utils/calculateTimeAgo";

const cloudFrontDomain = "https://dpz1evfcdl4g3.cloudfront.net";
const s3BucketDomain = "https://begenone-images.s3.us-east-1.amazonaws.com";

/**
 * Fetches an overview of videos and channels for the home feed.
 * Enriches videos with thumbnails, channel logos, and time-ago metadata.
 *
 * @param {Object} params
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @returns {Promise<Object>} Overview feed data
 */
export const getOverview = async ({ VIDEO_API_URL, CHANNEL_API_URL }) => {
  try {
    const GET_ALL_VIDEOS_ENDPOINT = "/api/v1/videos/route-video/";
    const GET_ALL_CHANNELS_ENDPOINT = "/api/v1/channels/channel-routes/";

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
        `${cloudFrontDomain}/${item.thumbnail}`,
      ])
    );

    const channelLogoMap = new Map(
      channels.map(channel => [
        channel._id,
        channel.channelLogo
          ? `${cloudFrontDomain}/${channel.channelLogo}`
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
          ? `${s3BucketDomain}/default-thumbnail.png`
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
