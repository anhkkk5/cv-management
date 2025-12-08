import { post } from "../../utils/axios/request";

export const registerCandidate = async ({ fullName, email, password, confirmPassword }) => {
  const payload = {
    name: fullName,
    email,
    password,
    confirmPassword,
    role: 'candidate',
  };
  return await post("auth/register", payload);
};

export const registerRecruiter = async ({ fullName, email, password, confirmPassword }) => {
  const payload = {
    name: fullName,
    email,
    password,
    confirmPassword,
    role: 'recruiter',
  };
  return await post("auth/register", payload);
};

export const login = async ({ email, password }) => {
  const res = await post("auth/login", { email, password });
  return res;
};

// Minimal JWT decode to read role without external deps
export const decodeJwt = (token) => {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json;
  } catch (_) {
    return null;
  }
};
