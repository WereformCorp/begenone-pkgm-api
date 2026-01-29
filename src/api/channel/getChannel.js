import axios from "axios";
import Bottleneck from "bottleneck";

/**
 * Fetches a channel with all associated videos and wires.
 */
export const getChannel = async ({
  channelId,
  CHANNEL_API_URL,
  VIDEO_API_URL,
  VIDEO_API_ENDPOINT,
  CLOUDFRONT_URL,
  GET_CHANNEL_ENDPOINT,
  DEFAULT_THUMBNAIL_URL,
  limiterOptions = {},
}) => {
  const limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
    ...limiterOptions,
  });

  return limiter.schedule(async () => {
    try {
      const { data: channelData } = await axios.get(
        `${CHANNEL_API_URL}${GET_CHANNEL_ENDPOINT}${channelId}`,
      );

      const extractedData = channelData.data;
      const { videos: videoIds } = extractedData;

      const queryParam = videoIds.join(",");

      const { data: videoData } = await axios.get(
        `${VIDEO_API_URL}${VIDEO_API_ENDPOINT}`,
        { params: { ids: queryParam } },
      );

      const allVideos = videoData.data;

      if (extractedData.channelLogo) {
        extractedData.channelLogo = `${CLOUDFRONT_URL}/${extractedData.channelLogo}`;
      }

      if (extractedData.bannerImage) {
        extractedData.bannerImage = `${CLOUDFRONT_URL}/${extractedData.bannerImage}`;
      }

      const latestVideo = allVideos.length > 0 ? allVideos[0] : null;
      const wiresData = extractedData.wires;

      allVideos.forEach(video => {
        video.thumbnailUrl =
          video.thumbnail && video.thumbnail.includes("default-thumbnail.jpeg")
            ? `${CLOUDFRONT_URL}/default-thumbnail.png`
            : `${CLOUDFRONT_URL}/${video.thumbnail}`;
      });

      if (latestVideo) {
        const key = latestVideo.thumbnail;
        latestVideo.thumbnailUrl =
          key &&
          (key.includes("default-thumbnail.jpeg") ||
            key.includes("default-thumbnail.png"))
            ? DEFAULT_THUMBNAIL_URL
            : `${CLOUDFRONT_URL}/${key}`;
      }

      return {
        channel: extractedData,
        latestVideo,
        channelLogo: extractedData.channelLogo,
        bannerImage: extractedData.bannerImage,
        videos: extractedData.videos,
        LatestVideoThumbnail: latestVideo ? latestVideo.thumbnailUrl : null,
        wiresData,
      };
    } catch (error) {
      console.error(
        "GET CHANNEL Error:",
        error?.response?.data || error?.message || error,
      );
      throw error;
    }
  });
};
