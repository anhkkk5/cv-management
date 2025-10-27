import { post } from "../../utils/axios/request";

export const registerAuth = async ({ email, password, role }) => {
  const payload = { email, password, role };
  const result = await post(`auth/register`, payload);
  return result;
};

