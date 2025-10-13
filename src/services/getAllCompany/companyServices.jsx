import { get, post, edit } from "../../utils/axios/request";
export const getDetaiCompany = async (id) => {
  const result = await get(`company/${id}`);
  return result;
};
export const checkExits = async (key, value) => {
  const result = await get(`company?${key}=${value}`);
  return result;
};

export const createCompany = async (options) => {
  const result = await post(`company`, options);
  return result;
};
export const loginCompany = async (email, password = "") => {
  let pass = "";
  if (pass !== "") {
    pass = `&password=${password}`;
  }
  const result = await get(`company?email=${email}${pass}`);
  return result;
};

export const editCompany = async (id, options) => {
  const result = await edit(`company/${id}`, options);
  return result;
};
