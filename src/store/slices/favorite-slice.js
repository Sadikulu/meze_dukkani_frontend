import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemFavorites: [],
};

export const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    addToFavorite(state, action) {
      state.itemFavorites.push(action.payload);
    },
    removeFromFavorite(state, action) {
      const newFavorite = state.itemFavorites.filter(
        (product) => product.productId !== action.payload.productId
      );
      state.itemFavorites = newFavorite;
    },
    removeAll(state) {
      state.itemFavorites = [];
    },
    setItems(state, action) {
      state.itemFavorites = action.payload;
    },
  },
});

export const { addToFavorite, removeFromFavorite, removeAll, setItems } = favoriteSlice.actions;

export default favoriteSlice.reducer;
