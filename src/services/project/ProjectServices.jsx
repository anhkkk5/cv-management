import { get, post, edit, del } from "../../utils/axios/request";
export const getProjectsByCandidate = async (candidateId) => {
  const result = await get(`Projects_Candidate?candidate_id=${candidateId}`);
  return result;
};

export const createProject = async (options) => {
  const result = await post(`Projects_Candidate`, options);
  return result;
};

export const updateProject = async (id, options) => {
  const result = await edit(`Projects_Candidate/${id}`, options);
  return result;
};

export const deleteProject = async (id) => {
  const result = await del(`Projects_Candidate/${id}`);
  return result;
};