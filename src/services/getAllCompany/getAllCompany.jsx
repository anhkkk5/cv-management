import { get } from "../../utils/axios/request";
export const getAllCompany = async () => {
  const result = await get("Companies");
  return result;
};
