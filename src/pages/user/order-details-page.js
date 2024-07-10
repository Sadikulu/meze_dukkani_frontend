import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import UserTemplate from "../../templates/user-template";
import Spacer from "../../components/common/spacer/spacer";
import OrderDetails from "../../components/user/profile/order-details";

const OrderDetailsPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Sipariş Detayı" />
      <Spacer />
      <OrderDetails />
      <Spacer />
    </UserTemplate>
  );
};

export default OrderDetailsPage;
