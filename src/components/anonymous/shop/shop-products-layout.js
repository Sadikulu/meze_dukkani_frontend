import React from "react";
import { Col, Row } from "react-bootstrap";
import ProductCard from "../home/product-card";
import "./shop-products-layout.scss";
const ShopProductsLayout = ({ products, filters }) => {
  let filteredProducts = products;
  if (filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      filters.categories.includes(product.category.id.toString())
    );
  }
  if (filters.minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.discountedPrice >= filters.minPrice
    );
  }
  if (filters.maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.discountedPrice <= filters.maxPrice
    );
  }
  //  return filteredProducts;
  return (
    <div className="shop-products-layout">
      <Row className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} sm={12} lg={6} xl={6}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopProductsLayout;
