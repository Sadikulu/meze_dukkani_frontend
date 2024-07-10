import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

export const newCategory = (newCategoryData) => {
  return axios.post(`${API_URL}/categories/create`, newCategoryData, {
    headers: authHeader(),
  });
};

export const updateCategoryById = (id, categoryData) => {
  return axios.put(`${API_URL}/categories/update/${id}`, categoryData, {
    headers: authHeader(),
  });
};

export const deleteCategoryById = (id) => {
  return axios.delete(`${API_URL}/categories/${id}`, { headers: authHeader() });
};

export const getCategoriesByPage = (
  q = "",
  status = "",
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  const qQuery = q ? `&q=${q}` : "";
  const statusQuery = status ? `&status=${status}` : "";
  return axios.get(
    `${API_URL}/categories?${qQuery}${statusQuery}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getCategoryById = (id) => {
  return axios.get(`${API_URL}/categories/${id}`, { headers: authHeader() });
};

//option
export const getCategoriesOption = () => {
  return axios.get(`${API_URL}/categories/option`, { headers: authHeader() });
};
