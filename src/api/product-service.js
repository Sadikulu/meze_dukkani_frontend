import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

/********USER********/

//Kullandık
export const getProductsByPage = ({
  q = "",
  categories = [],
  //brands = [],
  minPrice = "",
  maxPrice = "",
  status = "",
  page = 0,
  size = 12,
  sort = "id",
  direction = "ASC",
}) => {
  const qQuery = q ? `&q=${q}` : "";
  const categoriesQuery = categories.length
    ? `&categories=${categories.join(",")}`
    : "";
  //const brandsQuery = brands.length ? `&brands=${brands.join(",")}` : "";
  const minPriceQuery = minPrice ? `&minPrice=${minPrice}` : "";
  const maxPriceQuery = maxPrice ? `&maxPrice=${maxPrice}` : "";
  const statusQuery = status ? `&status=${status}` : "";
  return axios.get(
    `${API_URL}/products?${qQuery}${categoriesQuery}${minPriceQuery}${maxPriceQuery}${statusQuery}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    {
      headers: authHeader(),
    }
  );
};

export const getFeaturedProducts = (
  page = 0,
  size = 8,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/products/featured?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getNewProducts = (
  page = 0,
  size = 8,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/products/new?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};
//Kullandık
export const getProductById = (id) => {
  return axios.get(`${API_URL}/products/${id}`, {
    headers: authHeader(),
  });
};
/********ADMIN********/

//Kullandık
export const createProduct = (product) => {
  return axios.post(`${API_URL}/products/admin`, product, {
    headers: authHeader(),
  });
};
//Kullandık
export const deleteProductById = (id) => {
  return axios.delete(`${API_URL}/products/${id}/admin`, {
    headers: authHeader(),
  });
};
//Kullandık
export const updateProductById = (id, product) => {
  return axios.put(`${API_URL}/products/${id}/admin`, product, {
    headers: authHeader(),
  });
};

export const getMostPopulars = (
  page = 0,
  size = 8,
  sort = "totalQuantity",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/products/most-popular?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const addFavoriteById = (id) => {
  return axios.patch(
    `${API_URL}/products/${id}/auth/favorite`,
    {},
    { headers: authHeader() }
  );
};

export const getUserFavorites = () => {
  return axios.get(`${API_URL}/users/auth/favorites`, {
    headers: authHeader(),
  });
};

export const deleteUserFavorites = () => {
  return axios.delete(`${API_URL}/users/auth/favorites`, {
    headers: authHeader(),
  });
};

export const showCaseImage = (productId = "", imageId = "") => {
  return axios.patch(
    `${API_URL}/image/showcase?productId=${productId}&imageId=${imageId}`,
    {},
    { headers: authHeader() }
  );
};

export const deleteProductImageById = (id) => {
  return axios.delete(`${API_URL}/products/image/${id}`, {
    headers: authHeader(),
  });
};
