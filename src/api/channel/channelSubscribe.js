import axios from "axios";

/**
 * Extract subscribed channel ids from GET /users/me (or Redux `me`) payload.
 * Matches `subscribedChannelIdsFromMePayload` in frontend/mfe_channel ChannelLayout.jsx.
 *
 * @param {object|null|undefined} mePayload
 * @returns {string[]}
 */
export function subscribedChannelIdsFromMePayload(mePayload) {
  const userPayload =
    mePayload?.data?.user ||
    mePayload?.data ||
    mePayload?.user ||
    mePayload ||
    {};
  const rows =
    userPayload?.subscribedChannels || userPayload?.subscriptions || [];
  if (!Array.isArray(rows)) return [];
  return rows
    .map(row => {
      if (!row) return null;
      if (typeof row === "string") return row;
      if (typeof row === "object") {
        if (typeof row.channel === "string") return row.channel;
        if (row.channel?._id) return row.channel._id;
        if (row.channelId) return row.channelId;
        if (row._id) return row._id;
      }
      return null;
    })
    .filter(Boolean)
    .map(String);
}

/**
 * Logged-in user's own channel id (cannot subscribe to yourself). Same as web ChannelLayout `viewerChannelId`.
 *
 * @param {object|null|undefined} mePayload
 * @returns {string|null}
 */
export function viewerOwnChannelIdFromMe(mePayload) {
  const userPayload =
    mePayload?.data?.user ||
    mePayload?.data ||
    mePayload?.user ||
    mePayload ||
    {};
  const rawId = userPayload?.channel || userPayload?.channelId || null;
  return rawId ? String(rawId) : null;
}

/**
 * Subscribe or unsubscribe to a channel (same contract as web mfe_channel).
 * POST {CHANNEL_API}/api/v1/channels/subscribe-routes/:channelId/subscribe|unsubscribe
 *
 * @param {Object} params
 * @param {string} params.channelId
 * @param {boolean} params.subscribe - true = subscribe, false = unsubscribe
 * @param {string} params.CHANNEL_API_URL
 * @param {string|null} [params.token] - Bearer JWT (required for protected route on mobile)
 */
export async function toggleChannelSubscription({
  channelId,
  subscribe,
  CHANNEL_API_URL,
  token = null,
}) {
  const id = String(channelId ?? "").trim();
  if (!id) {
    throw new Error("toggleChannelSubscription: missing channelId");
  }
  const base = String(CHANNEL_API_URL || "").replace(/\/$/, "");
  if (!base) {
    throw new Error("toggleChannelSubscription: missing CHANNEL_API_URL");
  }
  const actionPath = subscribe ? "subscribe" : "unsubscribe";
  const url = `${base}/api/v1/channels/subscribe-routes/${id}/${actionPath}`;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  await axios.post(url, {}, { headers, withCredentials: true });
}
