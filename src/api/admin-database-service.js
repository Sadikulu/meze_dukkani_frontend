import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";

import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

export const getDashboardDatabase = () => {
  return axios.get(`${API_URL}/database`, {
    headers: authHeader(),
  });
};

export const deleteDashboardDatabase = () => {
  return axios.delete(`${API_URL}/database`, { headers: authHeader() });
};
