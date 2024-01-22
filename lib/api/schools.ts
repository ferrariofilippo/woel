import { School } from "@/types/api";
import { BASE_URL } from "../costants";

export const getSchools = async () => {
  const res = await fetch(BASE_URL + "/api/schools");
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
export const fetcher = async (url: string): Promise<School[]> => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};
export const getSchoolSpecializations = async (schoolId: number) => {
  const res = await fetch(
    `${BASE_URL}/api/schools/${schoolId}/specializations`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
