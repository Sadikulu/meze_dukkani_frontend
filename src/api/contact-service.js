import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

// USER ENDPOINT
export const sendMessage = (message) => {
  return axios.post(`${API_URL}/contact-message/visitors`, message);
};

// ADMIN ENDPOINTS

export const getMessagesByPage = (
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/contact-message/pages?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getMessage = (id) => {
  return axios.get(`${API_URL}/contact-message/${id}`, {
    headers: authHeader(),
  });
};

export const deleteMessage = (id) => {
  return axios.delete(`${API_URL}/contact-message/${id}`, {
    headers: authHeader(),
  });
};
