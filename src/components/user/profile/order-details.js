import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { BsArrowLeftSquare } from "react-icons/bs";
import Sidebar from "./sidebar";
import "./order-details.scss";
import { Link, useParams } from "react-router-dom";
import { orderUserById } from "../../../api/order-service";
import { settings } from "../../../helpers/setting";
import { getDate } from "../../../helpers/functions/date-time";

const OrderDetails = () => {
  const [ordersData, setOrdersData] = useState([]);
  const [orderDTO, setOrderDTO] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
  const { code, contactName, contactPhone, createAt, status } = ordersData;

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await orderUserById(orderId);
      setOrderDTO(resp.data.orderItemsDTO);
      setOrdersData(resp.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const [logistics, trackingNumber] = ordersData?.shippingDetails
    ? ordersData?.shippingDetails.split(" : ")
    : "";

  return (
    <Container className="order-details">
      <Row className="order-details-row">
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8} className="order-detail">
          <Row className="first-row">
            <Col lg={6} md={12}>
              <b>Sipariş Kodu:</b> {code}
            </Col>
            <Col lg={6} md={12}>
              <b>Durum:</b> {status}
            </Col>
            <Col lg={6} md={12}>
              <b>Sipariş Tarihi:</b> {!createAt ? "" : getDate(createAt)}
            </Col>

            <Col lg={6} md={12}>
              <b>İletişim İsmi:</b> {contactName}
            </Col>
            <Col lg={6} md={12}>
              <b>İletişim Numarası:</b> {contactPhone}
            </Col>
            <Col lg={6} md={12}>
              <b>Kargo Şirketi:</b> {logistics}
            </Col>
            <Col md={12}>
              <b>Kargo Takip Numarası:</b> {trackingNumber}
            </Col>
          </Row>

          <Table className="order-details-table">
            <thead>
              <tr>
                <th>Ürün Resmi</th>
                <th>Ürün İsmi</th>
                <th>Miktar</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {orderDTO.map((item, i) => (
                <tr key={i}>
                  <td>
                    <Link to={`/shop/${item.productId}`}>
                      <img
                        src={`${settings.apiURL}/image/display/${item.imageId}`}
                        alt=""
                      />
                    </Link>
                  </td>
                  <td>
                    <Link
                      to={`/shop/${item.productId}`}
                      style={{ color: "black" }}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.subTotal}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-end">
            <Link to="/user/orders">
              <BsArrowLeftSquare color="black" />
              Siparişlere Geri Dön
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderDetails;
