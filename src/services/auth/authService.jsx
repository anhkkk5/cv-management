import { post } from "../../utils/axios/request";

const postTry = async (paths, data) => {
  let lastErr;
  for (const p of paths) {
    try {
      return await post(p, data);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
};

// Try with and without global prefix 'api'
const withApi = (path) => [
  `/api/${path}`.replace(/\/+/g, "/"),
  `${path}`.replace(/\/+/g, "/"),
];

export const loginCandidate = async (email, password, role) => {
  const body = { email, password };
  if (role) body.role = role;
  const result = await postTry(withApi("auth/login"), body);
  return result; // expected { token, user }
};

export const loginCompany = async (email, password, role) => {
  const body = { email, password };
  if (role) body.role = role;
  const result = await postTry(withApi("auth/login"), body);
  return result; // expected { token, user }
};

export const registerCandidate = async (payload) => {
  const result = await postTry(withApi("auth/register"), payload);
  return result; // could be { id } or { token, user }
};

export const registerCompany = async (payload) => {
  const result = await postTry(withApi("auth/register"), payload);
  return result; // could be { id } or { token, user }
};
