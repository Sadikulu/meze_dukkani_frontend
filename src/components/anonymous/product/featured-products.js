import React from "react";
import { Col, Row } from "react-bootstrap";
import "../home/most-new-featured-products.scss";
import ProductCard from "../home/product-card";

const FeaturedProducts = ({ featuredProducts }) => {
  return (
    <div className="common-products">
      <div className="section-header">
        <h2>Öne Çıkan Ürünler</h2>
      </div>
      <Row className="g-4">
        {featuredProducts.map((product) => (
          <Col key={product.id} sm={6} md={4} lg={3}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default FeaturedProducts;
