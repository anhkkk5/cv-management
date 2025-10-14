import { get } from "../../utils/axios/request";
export const getLocation = async () => {
  const result = await get("Locations");
  return result;
};
export const getLocationById = async (id) => {
  const result = await get(`Locations/${id}`);
  return result;
};
