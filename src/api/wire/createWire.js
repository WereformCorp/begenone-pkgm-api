import axios from "axios";

export async function createWire({ WIRE_API_URL, wireText, heading, token }) {
  try {
    const url = `${WIRE_API_URL}/api/v1/wires/route-wires/`;
    console.log("CREATE WIRE URL ===>", url);

    console.log("Token in createWire ===>", token);
    const response = await axios.post(
      url,
      { wireText, heading },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response from createWire API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating wire:", error);
  }
}
