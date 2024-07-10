import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

// export const newCoupon = (newCouponData) => {
//   return axios.post(`${API_URL}/coupons/admin`, newCouponData, {
//     headers: authHeader(),
//   });
// };

// export const getCouponsById = (id) => {
//   return axios.get(`${API_URL}/coupons/${id}/admin`, { headers: authHeader() });
// };
// export const getCouponsByPage = (
//   page = 0,
//   size = 10,
//   sort = "id",
//   direction = "DESC"
// ) => {
//   return axios.get(
//     `${API_URL}/coupons/admin?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
//     { headers: authHeader() }
//   );
// };

// export const updateCouponById = (id, couponData) => {
//   return axios.put(`${API_URL}/coupons/${id}/admin`, couponData, {
//     headers: authHeader(),
//   });
// };

// export const deleteCouponById = (id) => {
//   return axios.delete(`${API_URL}/coupons/${id}/admin`, {
//     headers: authHeader(),
//   });
// };

export const getUserCouponsAdmin = (
  userId,
  page = 0,
  size = 3,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/order-coupon/${userId}?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getUserCouponCode = (couponCode) => {
  return axios.get(`${API_URL}/coupons/auth/${couponCode}`, {
    headers: authHeader(),
  });
};

// export const assignCoupon = (assignCouponData) => {
//   return axios.post(`${API_URL}/coupons/auth/send`, assignCouponData, {
//     headers: authHeader(),
//   });
// }
