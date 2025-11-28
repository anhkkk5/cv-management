import { get, post, edit, del, editForm } from "../../utils/axios/request";
import { getCookie } from "../../helpers/cookie";
import { decodeJwt } from "../auth/authServices";

const normalizeId = (value) => {
  if (!value) return "";
  if (typeof value === "number") return String(value);
  return `${value}`.trim();
};

const fetchCandidateById = async (candidateId) => {
  const normalized = normalizeId(candidateId);
  if (!normalized) return null;
  const tryPaths = [`candidates/${normalized}`, `Candidates/${normalized}`];
  let lastError;
  for (const path of tryPaths) {
    try {
      return await get(path);
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
};

// Backend uses authenticated user context for candidate profile
export const getMyCandidateProfile = async () => {
  try {
    const result = await get("candidates/me");
    return result;
  } catch (error) {
    const status = error?.response?.status;
    if (status !== 401 && status !== 403) throw error;

    let candidateId = getCookie("id");
    if (!candidateId) {
      const token = getCookie("token") || localStorage.getItem("token");
      if (token) {
        const payload = decodeJwt(token);
        candidateId = payload?.sub || payload?.id || "";
      }
    }
    if (!candidateId) throw error;
    return await fetchCandidateById(candidateId);
  }
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

export const uploadMyAvatar = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const result = await editForm("candidates/me/avatar", formData);
  return result;
};

export const deleteMyAvatar = async () => {
  const result = await del("candidates/me/avatar");
  return result;
};

export const uploadTemplateAvatar = async (templateId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const result = await editForm(`candidates/me/template-avatar/${templateId}`, formData);
  return result;
};

export const loginCandidates = async (email, password="") => {
  // Query by email only, password will be checked on client side 
  const result = await get(`Candidates?email=${email}`);
  return result;
};

export const checkExist = async (key, value) => {
  const result = await get(`candidates?${key}=${value}`);
  return result;
};

export const deleteCandidates = async(id) => {
  const result = await del(`candidates/${id}`);
  return result;
};

export const editCandidates = async(id, options) => {
  const result = await edit(`candidates/${id}`, options);
  return result;
};
