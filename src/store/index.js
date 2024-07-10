import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth-slice";
import cartSlice from "./slices/cart-slice";
import categoryBrandSlice from "./slices/category-brand-slice";
import favoriteSlice from "./slices/favorite-slice";

export default configureStore({
  reducer: {
    auth: authSlice,
    cart: cartSlice,
    categoryBrand: categoryBrandSlice,
    favorite: favoriteSlice,
  },
});
