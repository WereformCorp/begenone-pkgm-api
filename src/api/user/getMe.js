import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setMe } from "../../store/userSlice";

export const getMe = async (USER_API_URL, token) => {
  // const token = await getToken("user_session");

  if (!token) {
    console.log("No stored session token");
    return null;
  }

  try {
    const response = await axios.get(`${USER_API_URL}/api/v1/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("GET ME Success:", response.data);
    return response.data;
  } catch (error) {
    console.log(
      "GET ME Error:",
      error?.response?.status,
      error?.response?.data
    );
    throw error;
  }
};
