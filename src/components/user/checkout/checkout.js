import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ContactInfo from "./contact-info";
import ProductsCart from "./products-cart";

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [couponDiscounted, setCouponDiscounted] = useState("");

  const [couponNotDiscounted, setCouponNotDiscounted] = useState(0);
  const [resetValues, setResetValues] = useState(false);

  let discountAmount = couponDiscounted ? couponNotDiscounted - couponDiscounted : 0;

  useEffect(() => {
    if (resetValues) {
      setCouponDiscounted("");
      setCouponNotDiscounted(0);
      setResetValues(false);
    }
  }, [resetValues]);

  return (
    <Container>
      <Row className="g-5">
        <Col md={12}>
          <ContactInfo
            loading={loading}
            setLoading={setLoading}
            setCouponDiscounted={setCouponDiscounted}
            setCouponNotDiscounted={setCouponNotDiscounted}
            setResetValues={setResetValues}
          />
        </Col>
        <Col md={12}>
          <ProductsCart loading={loading} discountAmount={discountAmount}/>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
