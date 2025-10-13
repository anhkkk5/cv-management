import { get } from "../../utils/axios/request";
export const getAllCompany = async () => {
  const result = await get("company");
  return result;
};
