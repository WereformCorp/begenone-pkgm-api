import axios from "axios";

export async function updateUser({ USER_API_ENDPOINT, id, dataObj }) {
  try {
    const UPDATE_USER_ENDPOINT = `/api/v1/users/user/`;

    console.log(
      `ENDPOINT: `,
      `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`
    );

    const response = await axios.patch(
      `${USER_API_ENDPOINT}${UPDATE_USER_ENDPOINT}${id}`,

      dataObj
    );

    if (response) {
      console.log(`Data from Update User ——— Package API:`, response.data);
      const userData = response.data;

      return userData;
    }
  } catch (err) {
    console.log(`Error from Update User: `, err);
    throw err;
  }
}
