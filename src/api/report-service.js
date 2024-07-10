import axios from "axios";
//import authHeader from "../helpers/functions/auth-header";
import { authHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;

export const getReportOrders = (date1 = "", date2 = "", type = "") => {
  return axios.get(
    `${API_URL}/report/orders?date1=${date1}&date2=${date2}&type=${type}`,
    {
      headers: {
        ...authHeader(),
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
      responseType: "blob",
    }
  );
};

export const getMostPopulars = (amount) => {
  return axios.get(`${API_URL}/report/most-popular-products?amount=${amount}`, {
    headers: {
      ...authHeader(),
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });
};

export const getStockAlarms = () => {
  return axios.get(`${API_URL}/report/stock-alarm`, {
    headers: {
      ...authHeader(),
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });
};

export const getUnorderedProducts = () => {
  return axios.get(`${API_URL}/report/unordered-products`, {
    headers: {
      ...authHeader(),
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
    responseType: "blob",
  });
};
