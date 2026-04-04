import axios from "axios";

/**
 * Wire like / dislike — same contract as Wires MFE `postWireEngagement`.
 *
 * PATCH `{WIRE_API_URL}/api/v1/wires/route-engagement/:wiresId`
 * Body: `{ action: "like" | "dislike" }` — server toggles (repeat removes).
 *
 * Mobile: send Bearer JWT (no cookies).
 *
 * @param {Object} params
 * @param {string} params.wiresId
 * @param {"like"|"dislike"} params.action
 * @param {string} params.WIRE_API_URL
 * @param {string|null} [params.token] - raw JWT or `Bearer …`
 * @returns {Promise<{ wire?: object, userAction?: { liked: boolean, disliked: boolean } }>}
 */
export async function postWireEngagement({
  wiresId,
  action,
  WIRE_API_URL,
  token = null,
}) {
  if (!WIRE_API_URL) {
    throw new Error("WIRE_API_URL is not configured");
  }
  if (wiresId == null || String(wiresId).trim() === "") {
    throw new Error("wiresId is required");
  }
  if (action !== "like" && action !== "dislike") {
    throw new Error('action must be "like" or "dislike"');
  }

  const base = String(WIRE_API_URL).replace(/\/$/, "");
  const path = "api/v1/wires/route-engagement";
  const url = `${base}/${path}/${encodeURIComponent(String(wiresId))}`;

  const bearer =
    token != null && String(token).trim() !== ""
      ? String(token).replace(/^Bearer\s+/i, "").trim()
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
  };

  const response = await axios.patch(url, { action }, {
    headers,
    validateStatus: () => true,
  });

  const { status, data } = response;
  if (status >= 400) {
    const msg =
      data?.message ||
      data?.error ||
      `Engagement failed (${status})`;
    const err = new Error(msg);
    err.status = status;
    err.data = data;
    throw err;
  }

  const ok =
    data?.status == null ||
    String(data.status).toLowerCase() === "success";
  if (!ok) {
    throw new Error(data?.message || "Engagement failed");
  }

  return data?.data ?? {};
}
