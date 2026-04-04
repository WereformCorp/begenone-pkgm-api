import axios from "axios";

/**
 * Video search via the search microservice (same contract as web mfe_shared searchVideos.js).
 * GET /api/v1/search/route-video/search?q=
 *
 * @param {Object} params
 * @param {string} params.SEARCH_API_URL - Search service base URL (no trailing slash)
 * @param {string} params.query - User query
 * @returns {Promise<object[]>} Flat array of video objects
 */
export async function searchVideos({ SEARCH_API_URL, query }) {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) return [];

  const baseUrl = (SEARCH_API_URL || "").replace(/\/$/, "");
  if (!baseUrl) {
    console.warn(
      "searchVideos: Missing SEARCH_API_URL. Set extra.SEARCH_API_URL in app config.",
    );
    return [];
  }

  const url = `${baseUrl}/api/v1/search/route-video/search`;
  const res = await axios.get(url, {
    params: { q: normalizedQuery },
  });

  const json = res.data;

  const raw =
    json?.data?.data ??
    json?.data?.videos ??
    json?.data ??
    json?.videos ??
    (Array.isArray(json) ? json : []);

  return Array.isArray(raw) ? raw : [];
}
