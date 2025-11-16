import axios from "axios";
const isProd = process.env.NODE_ENV === "production";

// Configuration for CloudFront and S3
const cloudFrontDomain = "https://d123.cloudfront.net";
const s3BucketDomain = "https://begenone-images.s3.us-east-1.amazonaws.com";

const calculateTimeAgo = timestamp => {
  const timeDiff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(timeDiff / 60000);
  if (minutes < 60) return `${minutes} minute(s) ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour(s) ago`;
  const days = Math.floor(hours / 24);
  return `${days} day(s) ago`;
};

export const watchVideo = async ({
  videoId,
  CHANNEL_API_URL,
  VIDEO_API_URL,
}) => {
  try {
    // Fetch video and thumbnails data
    const videoRes = await axios.get(
      `${VIDEO_API_URL}/api/v1/videos/route-video/${videoId}`
    );
    // console.log(`Video Response: `, videoRes.data.data);

    const channelId = videoRes.data.data.channel;
    const channelRes = await axios.get(
      `${CHANNEL_API_URL}/api/v1/channels/channel-routes/${channelId}`
    );

    const channelData = channelRes.data.data;
    console.log(`Channel Response: `, channelData);

    const videosRes = await axios.get(
      `${VIDEO_API_URL}/api/v1/videos/route-video/`
    );
    const videoData = videoRes.data.data;

    // Process all videos
    const videosData = videosRes.data.data;

    // console.log(`All Videos Response: `, videosData);

    // console.log(`Video Data: `, videoData);

    const userId = channelData.user;

    // Map thumbnail URLs
    const thumbnailMap = new Map(
      videosData.map(item => [
        item.thumbnail,
        `${cloudFrontDomain}/${item.thumbnail}`,
      ])
    );

    const filteredVideos = videosData.filter(videoD => videoD.channel);

    // Add time ago for videos
    filteredVideos.forEach(videoD => {
      videoD.videoTimeAgo = calculateTimeAgo(videoD.time);
      videoD.thumbnailUrl =
        videoD.thumbnail === "default-thumbnail.png"
          ? `${s3BucketDomain}/default-thumbnail.png`
          : thumbnailMap.get(videoD.thumbnail) || null;

      // Handle channel logo URL
      const videoChannel = videoD.channel;
      videoD.channelLogoUrl = videoChannel
        ? `${cloudFrontDomain}/${videoChannel.channelLogo}`
        : null;
    });

    // Shuffle and limit videos
    const shuffleArray = array => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffleArray(filteredVideos);
    const limitedVideos = filteredVideos.slice(0, 6);

    // Check if the user is subscribed to the video's channel
    let isUserSubscribed = false;
    const videoUserData = videoData.user;
    if (userId && videoUserData) {
      const channelSubscribers = videoUserData.subscribedChannels || [];
      isUserSubscribed = channelSubscribers.includes(userId);
    }

    // Prepare the share link and button logic
    const shareLink = `${VIDEO_API_URL}/watch/${videoData._id}`;
    const btnText = isUserSubscribed ? "Subscribed" : "Subscribe";
    const btnClass = isUserSubscribed
      ? "sect-mid-vdoP-subsBtn-done"
      : "sect-mid-vdoP-subsBtn";

    // console.log(`${cloudFrontDomain}/${videoData.video}`);
    // Return the structured data for rendering
    return {
      videoData,
      cloudFrontVideoUrl: `${cloudFrontDomain}/${videoData.video}`,
      limitedVideos,
      isUserSubscribed,
      btnText,
      btnClass,
      shareLink,
      channelData,
      channelLogoUrl: videoData.channel
        ? `${cloudFrontDomain}/${videoData.channel.channelLogo}`
        : null,
      videoTimeAgo: calculateTimeAgo(videoData.time),
    };
  } catch (err) {
    console.error("Error in watchVideo API: ", err);
    throw new Error("Failed to load video data");
  }
};
