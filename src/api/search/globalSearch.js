import calculateTimeAgo from "../../utils/calculateTimeAgo";
import { searchVideos } from "./searchVideos";
import { searchWires } from "./searchWires";

function toAssetUrl(pathLike, cloudFrontUrl, fallbackFile) {
  const base = (cloudFrontUrl || "").replace(/\/$/, "");
  const raw = typeof pathLike === "string" ? pathLike.trim() : "";
  if (!raw) return `${base}/${fallbackFile}`;
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  return `${base}/${raw.replace(/^\//, "")}`;
}

/**
 * Map a raw search video document into the mobile home-feed card shape.
 *
 * @param {object} video
 * @param {string} CLOUDFRONT_URL
 * @param {string} S3BUCKETDOMAIN
 */
function enrichSearchVideo(video, CLOUDFRONT_URL, S3BUCKETDOMAIN) {
  const id = video?._id ?? video?.id;
  const thumb = video?.thumbnail;
  const thumbUrl =
    !thumb ||
    ["default-thumbnail.jpeg", "default-thumbnail.png"].includes(
      String(thumb),
    )
      ? `${S3BUCKETDOMAIN}/default-thumbnail.png`
      : toAssetUrl(String(thumb), CLOUDFRONT_URL, "default-thumbnail.png");

  const channelObj =
    video?.channel && typeof video.channel === "object" ? video.channel : null;
  const channelName = channelObj?.name ?? "Channel";
  const rawLogo =
    video?.channelLogo ??
    channelObj?.channelLogo ??
    channelObj?.logo ??
    "";

  const channelLogo = rawLogo
    ? toAssetUrl(String(rawLogo), CLOUDFRONT_URL, "default-user-photo.jpg")
    : `${String(CLOUDFRONT_URL || "").replace(/\/$/, "")}/default-user-photo.jpg`;

  const time = video?.time ?? video?.date ?? video?.createdAt;
  const videoTimeAgo = time ? calculateTimeAgo(time) : "—";

  const channel = channelObj
    ? { ...channelObj, name: channelName }
    : { name: channelName };

  return {
    ...video,
    _id: id,
    title: video?.title,
    thumbUrl,
    channelLogo,
    videoTimeAgo,
    views: video?.views ?? 0,
    channel,
  };
}

/**
 * Map a raw search wire into props-friendly shape for mobile wire cards.
 *
 * @param {object} wire
 * @param {string} CLOUDFRONT_URL
 */
function enrichSearchWire(wire, CLOUDFRONT_URL) {
  const id = wire?._id ?? wire?.id;
  const body =
    wire?.wireText ?? wire?.text ?? wire?.content ?? wire?.body ?? "";
  const ch = wire?.channel && typeof wire.channel === "object" ? wire.channel : null;
  const name =
    ch?.name ??
    wire?.username ??
    wire?.user?.username ??
    wire?.author?.name ??
    "User";

  const rawLogo = ch?.channelLogo ?? wire?.channelLogo ?? "";
  const channelLogo = rawLogo
    ? toAssetUrl(String(rawLogo), CLOUDFRONT_URL, "default-user-photo.jpg")
    : "https://begenone-images.s3.us-east-1.amazonaws.com/default-user-photo.jpg";

  const t = wire?.createdAt ?? wire?.time ?? wire?.date ?? wire?.updatedAt;
  const timeAgo = t ? calculateTimeAgo(t) : "—";

  return {
    ...wire,
    _id: id,
    wireText: body,
    content: body,
    userName: name,
    channelLogo,
    timeAgo,
    viewsText: wire?.views != null ? String(wire.views) : "0",
    channel: ch ? { ...ch, name } : { name },
  };
}

/**
 * Runs video + wire search in parallel (Promise.allSettled), same orchestration
 * as web SearchPageLayout, and returns mobile-normalized rows.
 *
 * @param {Object} params
 * @param {string} params.SEARCH_API_URL
 * @param {string} params.CLOUDFRONT_URL
 * @param {string} params.S3BUCKETDOMAIN
 * @param {string} params.query
 * @returns {Promise<{ videos: object[], wires: object[] }>}
 */
export async function globalSearch({
  SEARCH_API_URL,
  CLOUDFRONT_URL,
  S3BUCKETDOMAIN,
  query,
}) {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) {
    return { videos: [], wires: [] };
  }

  const cf = CLOUDFRONT_URL || "";
  const s3 = S3BUCKETDOMAIN || "";

  const [videoResult, wireResult] = await Promise.allSettled([
    searchVideos({ SEARCH_API_URL, query: normalizedQuery }),
    searchWires({ SEARCH_API_URL, query: normalizedQuery }),
  ]);

  const rawVideos =
    videoResult.status === "fulfilled" ? videoResult.value : [];
  const rawWires = wireResult.status === "fulfilled" ? wireResult.value : [];

  return {
    videos: rawVideos.map(v => enrichSearchVideo(v, cf, s3)),
    wires: rawWires.map(w => enrichSearchWire(w, cf)),
  };
}
