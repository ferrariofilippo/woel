import { BASE_URL } from "../costants";

export const getUserAds = async (username: string) => {
  const res = await fetch(BASE_URL + "/api/user/" + username + "/ads");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
