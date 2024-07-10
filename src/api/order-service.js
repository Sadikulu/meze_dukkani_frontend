import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { settings } from "../helpers/setting";
//import cartHeader from "../helpers/functions/cart-header";
import { cartHeader, authHeader } from "../helpers/functions/headers";
const API_URL = settings.apiURL;

// get userOrders
export const getOrdersByPage = (
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  return axios.get(
    `${API_URL}/orders/auth?page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

// get ordersAdmin

export const getOrdersAdmin = (
  q = "",
  status = "",
  startDate = "",
  endDate = "",
  page = 0,
  size = 10,
  sort = "id",
  direction = "DESC"
) => {
  const qQuery = q ? `&q=${q}` : "";
  const statusQuery = status ? `&status=${status}` : "";
  const startDateQuery = startDate ? `&startDate=${startDate}` : "";
  const endDateQuery = endDate ? `&endDate=${endDate}` : "";
  //  const statusQuery = status.length ? `&status=${status.join(",")}` : "";
  return axios.get(
    `${API_URL}/orders/admin?${qQuery}${statusQuery}${startDateQuery}${endDateQuery}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

export const getUserOrdersAdmin = (
  id,
  status = "",
  date1 = "",
  date2 = "",
  page = 0,
  size = 5,
  sort = "createAt",
  direction = "DESC"
) => {
  const statusQuery = status ? `&status=${status}` : "";
  const date1Query = date1 ? `&date1=${date1}` : "";
  const date2Query = date2 ? `&date2=${date2}` : "";
  // const statusQuery = status.length ? `&status=${status.join(",")}` : "";
  return axios.get(
    `${API_URL}/orders/admin/user/${id}?${statusQuery}${date1Query}${date2Query}&page=${page}&size=${size}&sort=${sort}&direction=${direction}`,
    { headers: authHeader() }
  );
};

// Aşağıdaki yorumu silmeyiniz. Bu yapı backend dokümanının query'den obje olarak bir parametre beklediği zamanlarda kullanılabilecek bir yapıdır.

// export const ordersCheckout = (orderRequest) => {
//   const queryString = Object.keys(orderRequest)
//     .map((key) => `${key}=${encodeURIComponent(orderRequest[key])}`)
//     .join("&");

//   return axios.post(`${API_URL}/orders/auth?${queryString}`, null, {
//     headers: {
//       ...cartHeader(),
//       ...authHeader(),
//     },
//   });
// };

export const ordersCheckout = (orderData) => {
  return axios.post(`${API_URL}/orders/auth`, orderData, {
    headers: {
      ...cartHeader(),
      ...authHeader(),
    },
  });
};

export const getOrdersById = (id) => {
  return axios.get(`${API_URL}/orders/${id}/admin`, { headers: authHeader() });
};

export const orderUserById = (id) => {
  return axios.get(`${API_URL}/orders/${id}/auth`, {
    headers: authHeader(),
  });
};

export const updateToOrder = (order) => {
  return axios.put(`${API_URL}/orders/auth`, order, {
    headers: authHeader(),
  });
};

export const updateToOrderStatus = (id, status = "") => {
  return axios.put(
    `${API_URL}/orders/auth/${id}?status=${status}`,
    {},
    {
      headers: authHeader(),
    }
  );
};
