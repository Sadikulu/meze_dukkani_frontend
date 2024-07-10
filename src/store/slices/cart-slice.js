import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const itemInCart = state.items.find(
        (item) => item.productId === action.payload.id
      );
      if (itemInCart) {
        itemInCart.quantity++;
        itemInCart.totalPrice =
          itemInCart.quantity * itemInCart.discountedPrice;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.productId === action.payload
      );
      item.quantity++;
      item.totalPrice = item.quantity * item.discountedPrice;
    },
    decrementQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.productId === action.payload
      );
      if (item.quantity > 0) {
        item.quantity--;
        item.totalPrice = item.quantity * item.discountedPrice;
      }
    },
    removeItem: (state, action) => {
      const removeItem = state.items.filter(
        (item) => item.productId !== action.payload
      );
      state.items = removeItem;
    },
    setCart: (state, action) => {
      state.items = action.payload;
    },
  },
});

export default cartSlice.reducer;

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  setCart,
} = cartSlice.actions;
