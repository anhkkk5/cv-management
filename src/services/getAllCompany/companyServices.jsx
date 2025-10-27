import { get, post, edit } from "../../utils/axios/request";
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

// Accounts for company login are stored in Account_Company
export const checkAccountExists = async (key, value) => {
  const result = await get(`Account_Company?${key}=${value}`);
  return result;
};

export const createAccountCompany = async (options) => {
  const result = await post(`Account_Company`, options);
  return result;
};
export const loginCompany = async (email, password = "") => {
  let pass = "";
  if (password !== "") {
    pass = `&password=${password}`;
  }
  // Accounts are stored in Account_Company per db.json
  const result = await get(`Account_Company?email=${email}${pass}`);
  return result;
};

export const editCompany = async (id, options) => {
  const result = await edit(`Companies/${id}`, options);
  return result;
};
