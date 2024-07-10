import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "./product-card";
import "./most-new-featured-products.scss";
import { getNewProducts } from "../../../api/product-service";
import { toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const resp = await getNewProducts();
      setProducts(resp.data.content);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container className="common-products">
      <div className="section-header">
        <h2>Yeni Ürünler</h2>
        <Link to="/shop">
          <h5>Hepsini Görün</h5>
        </Link>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <Row className="g-4">
          {products.map((product) => (
            <Col key={product.id} sm={6} md={4} lg={3}>
              <ProductCard {...product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
export default NewProducts;
