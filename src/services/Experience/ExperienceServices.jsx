import { get, post, edit, del } from "../../utils/axios/request";
export const getExperienceByCandidate = async (candidateId) => {
  const result = await get(`Experience_Candidate?candidate_id=${candidateId}`);
  return result;
};

export const createExperience = async (options) => {
  const result = await post(`Experience_Candidate`, options);
  return result;
};

export const updateExperience = async (id, options) => {
  const result = await edit(`Experience_Candidate/${id}`, options);
  return result;
};

export const deleteExperience = async (id) => {
  const result = await del(`Experience_Candidate/${id}`);
  return result;
};