import React from "react";
import Cart from "../../components/anonymous/cart/cart";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";

const CartPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Cart" />
      <Spacer height={75} />
      <Cart />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default CartPage;
