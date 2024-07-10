import {
  encryptedLocalStorage,
  encryptedSessionStorage,
} from "./encrypt-storage";

export const authHeader = () => {
  const token =
    encryptedLocalStorage.getItem("token") ||
    encryptedSessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const cartHeader = () => {
  const cartUUID =
    localStorage.getItem("cartUUID") || sessionStorage.getItem("cartUUID");
  return cartUUID ? { cartUUID } : {};
};
