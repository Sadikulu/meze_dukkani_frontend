import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";

import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

export const getUserAddresses = () => {
  return axios.get(`${API_URL}/user-addresses/auth`, {
    headers: authHeader(),
  });
};

export const getUserAddressesAdmin = (userId) => {
  return axios.get(`${API_URL}/user-addresses/admin/user/${userId}`, {
    headers: authHeader(),
  });
};

export const newAddress = (newAddressData) => {
  return axios.post(`${API_URL}/user-addresses/auth`, newAddressData, {
    headers: authHeader(),
  });
};

export const updateAddress = (id, updateAddressData) => {
  return axios.put(`${API_URL}/user-addresses/${id}/auth`, updateAddressData, {
    headers: authHeader(),
  });
};

export const deleteAddress = (id) => {
  return axios.delete(`${API_URL}/user-addresses/${id}/auth`, {
    headers: authHeader(),
  });
};

export const getAdressesById = (id) => {
  return axios.get(`${API_URL}/user-addresses/${id}/auth`, {
    headers: authHeader(),
  });
};
