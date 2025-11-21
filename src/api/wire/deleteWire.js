import axios from "axios";

export async function deleteWire({ WIRE_API_URL, id, token }) {
  console.log(`Token from Actual Request making Delete Wire: `, token);
  const response = await axios.delete(
    `${WIRE_API_URL}/api/v1/wires/route-wires/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(`Response from Delete Wire API: `, response.data);

  return response.data || true;
}
