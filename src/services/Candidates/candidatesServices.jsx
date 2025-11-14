import { get, post, edit, del } from "../../utils/axios/request";

// Backend uses authenticated user context for candidate profile
export const getMyCandidateProfile = async () => {
  const result = await get("candidates/me");
  return result;
};
export const getAllCandidates = async () => {
  const result = await get("candidates");
  return result;
};

export const createMyCandidateProfile = async (options) => {
  const result = await post("candidates/me", options);
  return result;
};

export const updateMyCandidateProfile = async (options) => {
  const result = await edit("candidates/me", options);
  return result;
};

export const updateIntroduction = async (intro) => {
  const result = await edit("candidates/me", { introduction: intro });
  return result;
};

export const loginCandidates = async (email, password="") => {
  // Query by email only, password will be checked on client side 
  const result = await get(`Candidates?email=${email}`);
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`candidates?${key}=${value}`,);
  return result;
};
export const deleteCandidates = async(id)=>{
  const result = await del(`candidates/${id}`)
  return result;
}

export const editCandidates = async(id, options)=>{
  const result = await edit(`candidates/${id}`, options);
  return result;
}