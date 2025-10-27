import { get, post, edit, del } from "../../utils/axios/request";
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