import axios from "axios";
//import cartHeader from "../helpers/functions/cart-header";
import { cartHeader } from "../helpers/functions/headers";
import { settings } from "../helpers/setting";

const API_URL = settings.apiURL;
// Sepete Ekleme yapacak
export const postAddToCart = (product) => {
  return axios.post(`${API_URL}/cart`, product, { headers: cartHeader() });
};
// Ürünü sepetten çıkaracak
export const deleteToCart = (productId) => {
  return axios.delete(`${API_URL}/cart/${productId}`, {
    headers: cartHeader(),
  });
};
// Sepetteki ürünleri getirecek
export const getToCart = () => {
  return axios.get(`${API_URL}/cart`, { headers: cartHeader() });
};
// Sepete eklenen ürünü artıracak ya da eksiltecek
export const updateToCart = (op, product) => {
  return axios.put(`${API_URL}/cart/${op}`, product, { headers: cartHeader() });
};
