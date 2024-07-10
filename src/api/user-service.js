import axios from "axios";
// import authHeader from "../helpers/functions/auth-header";
// import cartHeader from "../helpers/functions/cart-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

// USER ENDPOINTS
// Register
export const register = (user) => {
  return axios.post(`${API_URL}/register`, user);
};

// Login
export const login = (credential) => {
  return axios.post(
    `${API_URL}/login`,
    credential
    //{headers: cartHeader()}
  );
};

// Forgot-Password
export const forgotPassword = (userForm) => {
  return axios.post(`${API_URL}/forgot-password`, userForm);
};

// Reset Password
export const resetPassword = (token, newPassword) => {
  return axios.post(`${API_URL}/reset-password?token=${token}`, newPassword);
};

// confirm password
export const confirm = (token) => {
  return axios.get(`${API_URL}/confirm?token=${token}`);
};

// get getUser
export const getUser = () => {
  return axios.get(`${API_URL}/users/auth`, { headers: authHeader() });
};

// put UpdateUser
export const updateUser = (user) => {
  return axios.put(`${API_URL}/users/auth`, user, { headers: authHeader() });
};

// patch updatePassword
export const updatePassword = (credential) => {
  return axios.patch(`${API_URL}/users/auth`, credential, {
    headers: authHeader(),
  });
};

//  ADMIN ENDPOINTS
export const getUsersByPage = (
  q = "",
  role = "",
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  const qQuery = q ? `&q=${q}` : "";
  const roleQuery = role ? `&role=${role}` : "";
  return axios.get(
    `${API_URL}/users/pages?${qQuery}${roleQuery}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getAllUsers = (
  q = "",
  role = "",
  birthday = false,
  anniversary = false
) => {
  const qQuery = q ? `&q=${q}` : "";
  const roleQuery = role ? `&role=${role}` : "";
  const birthdayQuery = birthday ? `&birthday=${birthday}` : "";
  const anniversaryQuery = anniversary ? `&anniversary=${anniversary}` : "";

  return axios.get(
    `${API_URL}/users?${qQuery}${roleQuery}${birthdayQuery}${anniversaryQuery}`,
    { headers: authHeader() }
  );
};

// admin get users GET
export const getUserById = (id) => {
  return axios.get(`${API_URL}/users/${id}/admin`, { headers: authHeader() });
};

// admin delete users DELETE
export const deleteUserById = (id) => {
  return axios.delete(`${API_URL}/users/${id}/admin`, {
    headers: authHeader(),
  });
};

// admin update users PUT
export const updateUserById = (id, user) => {
  return axios.put(`${API_URL}/users/${id}/admin`, user, {
    headers: authHeader(),
  });
};
