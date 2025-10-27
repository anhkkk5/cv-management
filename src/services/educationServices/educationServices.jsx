import { get, post, edit, del } from "../../utils/axios/request";
export const getEducationByCandidate = async (candidateId) => {
  const result = await get(`Education_Candidate?candidate_id=${candidateId}`);
  return result;
};

export const createEducation = async (options) => {
  const result = await post(`Education_Candidate`, options);
  return result;
};

export const updateEducation = async (id, options) => {
  const result = await edit(`Education_Candidate/${id}`, options);
  return result;
};

export const deleteEducation = async (id) => {
  const result = await del(`Education_Candidate/${id}`);
  return result;
};