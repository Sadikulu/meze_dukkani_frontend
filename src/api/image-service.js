import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";
const API_URL = settings.apiURL;

export const uploadImage = (image) => {
  return axios.post(`${API_URL}/image/upload`, image, {
    headers: { ...authHeader(), "Content-Type": "multipart/form-data" },
  });
};

export const deleteImage = (id) => {
  return axios.delete(`${API_URL}/image/${id}`, {
    headers: authHeader(),
  });
};
