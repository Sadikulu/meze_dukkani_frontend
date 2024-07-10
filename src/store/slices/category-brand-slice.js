import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategories: [],
  //selectedBrands: [],
  searchQuery: "", // Yeni eklendi
};

const categoryBrandSlice = createSlice({
  name: "categoryBrand",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      state.selectedCategories.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.selectedCategories = state.selectedCategories.filter(
        (id) => id !== action.payload
      );
    },
    clearCategories: (state) => {
      state.selectedCategories = [];
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // Yeni eklendi
    },
  },
});

export const {
  addCategory,
  removeCategory,
  clearCategories,
  setSearchQuery, // Yeni eklendi
} = categoryBrandSlice.actions;

export default categoryBrandSlice.reducer;
