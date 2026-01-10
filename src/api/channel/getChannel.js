import axios from "axios";

/**
 * Fetches a channel with all associated videos and wires,
 * and resolves CloudFront image URLs.
 *
 * @param {Object} params - Channel fetch parameters
 * @param {string} params.channelId - Channel unique ID
 * @param {string} params.CHANNEL_API_URL - Channel service base URL
 * @param {string} params.VIDEO_API_URL - Video service base URL
 *
 * @example
 * URL Must start and end with a forward slash.
 * Example: "https://api.example.com/"
 *
 * @param {string} params.CLOUDFRONT_URL - CloudFront base URL
 * @returns {Promise<Object>} Channel data with videos and metadata
 */
export const getChannel = async ({
  channelId,
  CHANNEL_API_URL,
  VIDEO_API_URL,
  VIDEO_API_ENDPOINT,
  CLOUDFRONT_URL,
  GET_CHANNEL_ENDPOINT,
  DEFAULT_THUMBNAIL_URL,
}) => {
  try {
    const { data: channelData } = await axios.get(
      `${CHANNEL_API_URL}${GET_CHANNEL_ENDPOINT}${channelId}`
    );

    const extractedData = channelData.data;

    console.log("Get Channel | Extracted Data:", extractedData);

    const { videos: videoIds } = extractedData;

    console.log("Channel Video IDs:", videoIds);

    const queryParam = videoIds.join(",");

    const { data: videoData } = await axios.get(
      `${VIDEO_API_URL}${VIDEO_API_ENDPOINT}`,
      {
        params: {
          ids: queryParam,
        },
      }
    );

    console.log("Video Data:", videoData);

    const allVideos = videoData.data;

    // Add CloudFront URL to channelLogo and bannerImage
    if (extractedData.channelLogo) {
      extractedData.channelLogo = `${CLOUDFRONT_URL}/${extractedData.channelLogo}`;
    }

    if (extractedData.bannerImage) {
      extractedData.bannerImage = `${CLOUDFRONT_URL}/${extractedData.bannerImage}`;
    }

    const { videos } = extractedData;
    const latestVideo = allVideos.length > 0 ? allVideos[0] : null;

    const wiresData = extractedData.wires;
    const LatestVidThumbKey = latestVideo?.thumbnail || null;

    allVideos.forEach(video => {
      if (
        video.thumbnail &&
        video.thumbnail.includes("default-thumbnail.jpeg")
      ) {
        video.thumbnailUrl = `${CLOUDFRONT_URL}/default-thumbnail.png`;
      } else {
        video.thumbnailUrl = `${CLOUDFRONT_URL}/${video.thumbnail}`;
      }
    });

    if (latestVideo) {
      latestVideo.thumbnailUrl =
        LatestVidThumbKey &&
        (LatestVidThumbKey.includes("default-thumbnail.jpeg") ||
          LatestVidThumbKey.includes("default-thumbnail.png"))
          ? DEFAULT_THUMBNAIL_URL
          : `${CLOUDFRONT_URL}/${latestVideo.thumbnail}` || null;
    }

    return {
      channel: extractedData,
      latestVideo,
      channelLogo: extractedData.channelLogo,
      bannerImage: extractedData.bannerImage,
      videos,
      LatestVideoThumbnail: latestVideo ? latestVideo.thumbnailUrl : null,
      wiresData,
    };
  } catch (error) {
    console.error(
      "GET CHANNEL Error:",
      error?.response?.data || error?.message || error
    );
    throw error;
  }
};
