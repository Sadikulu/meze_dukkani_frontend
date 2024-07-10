import React from "react";
import Checkout from "../../components/user/checkout/checkout";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import UserTemplate from "../../templates/user-template";

const CheckoutPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Ödeme Sayfası" />
      <Spacer height={75} />
      <Checkout />
      <Spacer />
    </UserTemplate>
  );
};

export default CheckoutPage;
