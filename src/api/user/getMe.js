import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setMe } from "../../store/userSlice";

export const getMe = async USER_API_URL => {
  try {
    const response = await axios.get(`${USER_API_URL}/api/v1/users/me/`, {
      withCredentials: true,
    });

    console.log(`Login Response: `, response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const useUserData = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    refetchInterval: 60000,
    staleTime: 30000,
    // onSuccess: newData => {
    //   console.log("onSuccess triggered with newData: ", newData);
    // },
    onError: error => {
      console.error("Fetching user data failed:", error);
    },
  });

  if (isLoading) {
    return <h1>Loading user data...</h1>;
  }

  dispatch(setMe(data));

  return { data, isLoading, isError };
};
