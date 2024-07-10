import { getToCart } from "../../api/shopping-cart-service";
import store from "../../store";
import { setCart } from "../../store/slices/cart-slice";

export const loadCart = async () => {
  try {
    const cartUUID =
      localStorage.getItem("cartUUID") || sessionStorage.getItem("cartUUID");
    const resp = await getToCart();
    if (cartUUID) {
      store.dispatch(setCart(resp.data.shoppingCartItemDTO));
    } else {
      localStorage.setItem("cartUUID", resp.data.cartUUID);
    }
  } catch (err) {
    console.error(err);
    store.dispatch(setCart([]));
  }
};
