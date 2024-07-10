import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
// import cartHeader from "../helpers/functions/cart-header";
import { settings } from "../helpers/setting";
const API_URL = settings.apiURL;

/****USER******* */

export const sendMessage = (productId) => {
  return axios.post(`${API_URL}/reviews/auth`, productId, {
    headers: authHeader(),
  });
};

/****ADMIN******* */
export const getCommentsByPage = (
  id,
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/reviews/admin/user/${id}?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getAllCommentsByPage = (
  q = "",
  rate = "",
  status = "",
  page = 0,
  size = 5,
  sort = "id",
  direction = "DESC"
) => {
  const qQuery = q ? `&q=${q}` : "";
  const rateQuery = rate ? `&rate=${rate}` : "";
  const statusQuery = status ? `&status=${status}` : "";
  return axios.get(
    `${API_URL}/reviews/admin?${qQuery}${rateQuery}${statusQuery}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getReviewsProductById = (
  id,
  page = 0,

  size = 5,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/reviews/product/${id}?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const deleteReviews = (id) => {
  return axios.delete(`${API_URL}/reviews/${id}/admin`, {
    headers: authHeader(),
  });
};

export const getUserReviewsAdmin = (
  id,
  page = 0,
  size = 3,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/reviews/admin/user/${id}?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const updateReviewById = (id, review) => {
  return axios.put(`${API_URL}/reviews/${id}/admin`, review, {
    headers: authHeader(),
  });
};
