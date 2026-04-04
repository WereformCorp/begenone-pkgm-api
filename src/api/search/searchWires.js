import axios from "axios";

/**
 * Wire search via the search microservice (same contract as web mfe_shared searchWires.js).
 * GET /api/v1/search/route-wires/search?q=
 *
 * @param {Object} params
 * @param {string} params.SEARCH_API_URL - Search service base URL (no trailing slash)
 * @param {string} params.query - User query
 * @returns {Promise<object[]>} Flat array of wire objects
 */
export async function searchWires({ SEARCH_API_URL, query }) {
  const normalizedQuery = String(query || "").trim();
  if (!normalizedQuery) return [];

  const baseUrl = (SEARCH_API_URL || "").replace(/\/$/, "");
  if (!baseUrl) {
    console.warn(
      "searchWires: Missing SEARCH_API_URL. Set extra.SEARCH_API_URL in app config.",
    );
    return [];
  }

  const url = `${baseUrl}/api/v1/search/route-wires/search`;
  const res = await axios.get(url, {
    params: { q: normalizedQuery },
  });

  const json = res.data;

  const raw =
    json?.data?.data ??
    json?.data?.wires ??
    json?.data ??
    json?.wires ??
    (Array.isArray(json) ? json : []);

  return Array.isArray(raw) ? raw : [];
}
