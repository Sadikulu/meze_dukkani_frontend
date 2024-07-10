import React from "react";
import { Col, Row } from "react-bootstrap";
import ProductCard from "../home/product-card";

const ShopProducts = ({ products, filters }) => {
  const filteredProducts = products.filter((product) => {
    if (
      filters.q &&
      !product.title.toLowerCase().includes(filters.q.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category.id.toString())
    ) {
      return false;
    }
    if (filters.minPrice && product.discountedPrice <= filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.discountedPrice >= filters.maxPrice) {
      return false;
    }
    return true;
  });
  return (
    <div className="shop-products">
      <Row className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} sm={6} lg={4} xl={3}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShopProducts;
