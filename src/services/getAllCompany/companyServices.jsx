import { get, post, edit, del } from "../../utils/axios/request";
export const getAllCompany = async () => {
  const result = await get("Companies");
  return result;
};

export const getDetaiCompany = async (id) => {
  const result = await get(`Companies/${id}`);
  return result;
};
export const checkExits = async (key, value) => {
  const result = await get(`Companies?${key}=${value}`);
  return result;
};

export const createCompany = async (options) => {
  const result = await post(`Companies`, options);
  return result;
};
export const loginCompany = async (email, password = "") => {
  // Query by email only, password will be checked on client side
  const result = await get(`Companies?email=${email}`);
  return result;
};

export const editCompany = async (id, options) => {
  const result = await edit(`Companies/${id}`, options);
  return result;
};

export const deleteCompany = async (id) => {
  const result = await del(`Companies/${id}`);
  return result;
};
