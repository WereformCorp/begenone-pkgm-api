import axios from "axios";

/** Converts a timestamp into a human-readable relative string (e.g. "2 hour(s) ago") */
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
    // 1. Fetch the primary video by ID from the video service
    const videoRes = await axios.get(
      `${VIDEO_API_URL}${GET_VIDEO_ENDPOINT}${videoId}`,
    );

    // 2. Extract channel ID from video, then fetch channel details (name, logo, etc.)
    const channelId = videoRes.data.data.channel;
    const channelRes = await axios.get(
      `${CHANNEL_API_URL}${GET_CHANNEL_ENDPOINT}${channelId}`,
    );

    const channelData = channelRes.data.data;

    // 3. Fetch all videos for related/recommended content
    const videosRes = await axios.get(
      `${VIDEO_API_URL}${GET_ALL_VIDEOS_ENDPOINT}`,
    );

    const videoData = videoRes.data.data;
    const videosData = videosRes.data.data;

    // Channel owner's user ID — used later to check subscription status
    const userId = channelData.user;

    // 4. Build thumbnail → CloudFront URL map to avoid repeated URL construction
    const thumbnailMap = new Map(
      videosData.map(item => [
        item.thumbnail,
        `${CLOUDFRONTDOMAIN}/${item.thumbnail}`,
      ]),
    );

    // 5. Keep only videos with an associated channel (exclude orphaned entries)
    const filteredVideos = videosData.filter(videoD => videoD.channel);

    // 6. Enrich each video with human-readable time, thumbnail URL, and channel logo URL
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

    // 7. Fisher–Yates shuffle for randomized recommendations
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(filteredVideos);
    // 8. Limit recommendations to 6 videos
    const limitedVideos = filteredVideos.slice(0, 6);

    // 9. Determine if current user is subscribed to the channel (requires populated user on video)
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

    // Resolves relative paths to full URLs; returns as-is if already absolute
    const toAbsoluteUrl = (domain, value) => {
      if (!value) return null;
      const str = String(value).trim();
      if (/^https?:\/\//i.test(str)) return str;
      return `${domain}/${encodeURIComponent(str)}`;
    };

    // 10. Build full CloudFront URL for the main video asset
    const cloudFrontVideoUrl = toAbsoluteUrl(CLOUDFRONTDOMAIN, videoData.video);

    console.log("Constructed CloudFront Video URL:", cloudFrontVideoUrl);

    // 11. Return the full watch payload for the video player UI
    return {
      videoData,
      cloudFrontVideoUrl,
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
