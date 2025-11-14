import { get, del, post, edit } from "../../utils/axios/request";
export const getAlljob = async () => {
  const result = await get("jobs");
  return result;
};
export const getDetaiJob = async (id) => {
  const result = await get(`jobs/${id}`);
  return result;
};
export const getListJob = async (companyId) => {
  const list = await get(`jobs`);
  if (!companyId) return list;
  return Array.isArray(list) ? list.filter((j) => j.company_id === companyId) : [];
};

export const deleteJob = async (id) => {
  const result = await del(`jobs/${id}`);
  return result;
};
export const createJob = async (options) => {
  const result = await post("jobs", options);
  return result;
};

export const updateJob = async (id, options) => {
  const result = await edit(`jobs/${id}`, options);
  return result;
};
