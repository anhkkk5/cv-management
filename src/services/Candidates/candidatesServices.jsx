import { get, post, edit, del } from "../../utils/axios/request";

export const getAllCandidates = async () => {
  const result = await get("Candidates");
  return result;
};

export const getDetailCandidates = async (id) => {
  const result = await get(`Candidates/${id}`);
  return result;
};

export const checkExits = async (key, value) => {
  const result = await get(`Candidates?${key}=${value}`);
  return result;
};

export const createCandidates = async (options) => {
  const result = await post(`Candidates`, options);
  return result;
};

export const loginCandidates = async (email, password="") => {
  // Query by email only, password will be checked on client side
  const result = await get(`Candidates?email=${email}`);
  return result;
};

export const editCandidates = async (id, options) => {
  const result = await edit(`Candidates/${id}`, options);
  return result;
};

export const updateIntroduction = async (candidateId, intro) => {
  const result = await edit(`Candidates/${candidateId}`, { introduction: intro });
  return result;
};

export const deleteCandidates = async (id) => {
  const result = await del(`Candidates/${id}`);
  return result;
};