import React from "react";
import OrderDetails from "../../../components/admin/orders/order-details";

import AdminTemplate from "../../../templates/admin-template";

const AdminOrderDetailsPage = () => {
  return (
    <AdminTemplate>
      <OrderDetails />
    </AdminTemplate>
  );
};

export default AdminOrderDetailsPage;
