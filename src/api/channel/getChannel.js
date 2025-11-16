import axios from "axios";

// Function to fetch channel data for React components
export const getChannel = async (channelId, CHANNEL_API_URL, VIDEO_API_URL) => {
  try {
    // Fetch data from the backend API endpoint
    const { data: channelData } = await axios.get(
      `${CHANNEL_API_URL}/api/v1/channels/channel-routes/${channelId}`
    );

    // Map and transform the data as needed
    const extractedData = channelData.data;

    console.log(`Extracted Data: `, extractedData);

    const { videos: videoIds } = extractedData;

    console.log(`Video IDs: `, videoIds);

    const queryParam = videoIds.join(",");

    const { data: videoData } = await axios.get(
      `${VIDEO_API_URL}/api/v1/videos/route-video/`,
      {
        params: {
          ids: queryParam,
        },
      }
    );

    console.log(`Video Data: `, videoData);

    const allVideos = videoData.data;

    console.log(`Extracted Data: `, extractedData);
    console.log(`Video Data after extraction: `, videoData.data);

    // Add CloudFront URL to channelLogo and bannerImage
    if (extractedData.channelLogo) {
      extractedData.channelLogo = `${cloudFrontDomain}/${extractedData.channelLogo}`;
    }

    if (extractedData.bannerImage) {
      extractedData.bannerImage = `${cloudFrontDomain}/${extractedData.bannerImage}`;
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
        video.thumbnailUrl = `${cloudFrontDomain}/default-thumbnail.png`;
      } else {
        video.thumbnailUrl = `${cloudFrontDomain}/${video.thumbnail}`;
      }
    });

    if (latestVideo) {
      latestVideo.thumbnailUrl =
        LatestVidThumbKey &&
        (LatestVidThumbKey.includes("default-thumbnail.jpeg") ||
          LatestVidThumbKey.includes("default-thumbnail.png"))
          ? `https://begenone-images.s3.us-east-1.amazonaws.com/default-thumbnail.png`
          : `${cloudFrontDomain}/${latestVideo.thumbnail}` || null;
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
    console.error("Error fetching channel data:", error);
    throw error; // Propagate error if needed
  }
};
