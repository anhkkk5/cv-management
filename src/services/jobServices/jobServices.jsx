import { get, del, post, edit } from "../../utils/axios/request";
export const getAlljob = async () => {
  const result = await get("Jobs");
  return result;
};
export const getDetaiJob = async (id) => {
  const result = await get(`Jobs/${id}`);
  return result;
};
export const getListJob = async (companyId) => {
  const result = await get(`Jobs?company_id=${companyId}`);
  return result;
};

export const deleteJob = async (id) => {
  const result = await del(`Jobs/${id}`);
  return result;
};
export const createJob = async (options) => {
  const result = await post("Jobs", options);
  return result;
};

export const updateJob = async (id, options) => {
  const result = await edit(`Jobs/${id}`, options);
  return result;
};
