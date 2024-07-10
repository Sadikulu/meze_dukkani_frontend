import React from "react";
import FloatingCart from "../../components/anonymous/floating-cart/floating-cart";
import NewProducts from "../../components/anonymous/home/new-products";
import SearchBar from "../../components/anonymous/home/search-bar";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";
import MostPopular from "../../components/anonymous/home/most-popular";
import ScrollButton from "../../components/common/scroll-to-top/scroll-button";

const HomePage = () => {
  return (
    <AnonymousTemplate>
      <SearchBar />
      <Spacer />
      <MostPopular />
      <Spacer />
      <NewProducts />
      <Spacer />
      <FloatingCart />
      <ScrollButton />
    </AnonymousTemplate>
  );
};

export default HomePage;
