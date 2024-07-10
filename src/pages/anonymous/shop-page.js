import React from "react";
import FloatingCart from "../../components/anonymous/floating-cart/floating-cart";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Shop from "../../components/anonymous/shop/shop";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";
import ScrollButton from "../../components/common/scroll-to-top/scroll-button";

const ShopPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Ürünler" />
      <Spacer />
      <Shop />
      <Spacer />
      <FloatingCart />
      <ScrollButton />
    </AnonymousTemplate>
  );
};

export default ShopPage;
