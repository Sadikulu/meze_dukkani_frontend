import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import ProductDetails from "../../components/anonymous/product/product-details";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";

const ProductDetailsPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Ürün Detayı" />
      <ProductDetails />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default ProductDetailsPage;
