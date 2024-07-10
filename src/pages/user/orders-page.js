import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import UserTemplate from "../../templates/user-template";
import Orders from "../../components/user/profile/orders";

const OrdersPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Siparişler" />
      <Spacer />
      <Orders />
      <Spacer />
    </UserTemplate>
  );
};

export default OrdersPage;
