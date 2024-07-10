import React from "react";
import Products from "../../../components/admin/products/products";
import AdminTemplate from "../../../templates/admin-template";
import ScrollButton from "../../../components/common/scroll-to-top/scroll-button";

const AdminProductsPage = () => {
  return (
    <AdminTemplate>
      <Products/>
      <ScrollButton/>
    </AdminTemplate>
  );
};

export default AdminProductsPage;
