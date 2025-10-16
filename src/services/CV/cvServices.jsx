import { get, post, edit, del } from "../../utils/axios/request";

// Education Services
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

// Experience Services
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

// Projects Services (cần thêm vào database.json)
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

// Certificates Services (cần thêm vào database.json)
export const getCertificatesByCandidate = async (candidateId) => {
  const result = await get(`Certificates_Candidate?candidate_id=${candidateId}`);
  return result;
};

export const createCertificate = async (options) => {
  const result = await post(`Certificates_Candidate`, options);
  return result;
};

export const updateCertificate = async (id, options) => {
  const result = await edit(`Certificates_Candidate/${id}`, options);
  return result;
};

export const deleteCertificate = async (id) => {
  const result = await del(`Certificates_Candidate/${id}`);
  return result;
};

// Introduction Services (lưu trong Candidates)
export const updateIntroduction = async (candidateId, intro) => {
  const result = await edit(`Candidates/${candidateId}`, { introduction: intro });
  return result;
};
