import axios from "axios";

const calculateTimeAgo = timestamp => {
  const timeDiff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(timeDiff / 60000);
  if (minutes < 60) return `${minutes} minute(s) ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour(s) ago`;
  const days = Math.floor(hours / 24);
  return `${days} day(s) ago`;
};

/**
 * Fetches a video, its channel, and related video recommendations.
 *
 * @param {Object} params
 * @param {string} params.videoId - Video ID to watch
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @param {string} params.VIDEO_API_URL - Video service base URL
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @returns {Promise<Object>} Video watch data bundle
 */
export const watchVideo = async ({
  videoId,
  CHANNEL_API_URL,
  VIDEO_API_URL,
  GET_VIDEO_ENDPOINT,
  GET_CHANNEL_ENDPOINT,
  GET_ALL_VIDEOS_ENDPOINT,
  S3BUCKETDOMAIN,
  CLOUDFRONTDOMAIN,
}) => {
  try {
    const videoRes = await axios.get(
      `${VIDEO_API_URL}${GET_VIDEO_ENDPOINT}${videoId}`
    );

    const channelId = videoRes.data.data.channel;
    const channelRes = await axios.get(
      `${CHANNEL_API_URL}${GET_CHANNEL_ENDPOINT}${channelId}`
    );

    const channelData = channelRes.data.data;

    const videosRes = await axios.get(
      `${VIDEO_API_URL}${GET_ALL_VIDEOS_ENDPOINT}`
    );

    const videoData = videoRes.data.data;
    const videosData = videosRes.data.data;

    const userId = channelData.user;

    const thumbnailMap = new Map(
      videosData.map(item => [
        item.thumbnail,
        `${CLOUDFRONTDOMAIN}/${item.thumbnail}`,
      ])
    );

    const filteredVideos = videosData.filter(videoD => videoD.channel);

    filteredVideos.forEach(videoD => {
      videoD.videoTimeAgo = calculateTimeAgo(videoD.time);
      videoD.thumbnailUrl =
        videoD.thumbnail === "default-thumbnail.png"
          ? `${S3BUCKETDOMAIN}/default-thumbnail.png`
          : thumbnailMap.get(videoD.thumbnail) || null;

      const videoChannel = videoD.channel;
      videoD.channelLogoUrl = videoChannel
        ? `${CLOUDFRONTDOMAIN}/${videoChannel.channelLogo}`
        : null;
    });

    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(filteredVideos);
    const limitedVideos = filteredVideos.slice(0, 6);

    let isUserSubscribed = false;
    const videoUserData = videoData.user;
    if (userId && videoUserData) {
      const channelSubscribers = videoUserData.subscribedChannels || [];
      isUserSubscribed = channelSubscribers.includes(userId);
    }

    const shareLink = `${VIDEO_API_URL}/watch/${videoData._id}`;
    const btnText = isUserSubscribed ? "Subscribed" : "Subscribe";
    const btnClass = isUserSubscribed
      ? "sect-mid-vdoP-subsBtn-done"
      : "sect-mid-vdoP-subsBtn";

    return {
      videoData,
      cloudFrontVideoUrl: `${CLOUDFRONTDOMAIN}/${videoData.video}`,
      limitedVideos,
      isUserSubscribed,
      btnText,
      btnClass,
      shareLink,
      channelData,
      channelLogoUrl: videoData.channel
        ? `${CLOUDFRONTDOMAIN}/${videoData.channel.channelLogo}`
        : null,
      videoTimeAgo: calculateTimeAgo(videoData.time),
    };
  } catch (err) {
    console.error("watchVideo API Error:", err);
    throw new Error("Failed to load video data");
  }
};
