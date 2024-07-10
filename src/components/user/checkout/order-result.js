import React, { useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { getDate, getTime } from "../../../helpers/functions/date-time";
import "./order-result.scss";
import { Link } from "react-router-dom";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { settings } from "../../../helpers/setting";

const OrderResult = ({ orderResult }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);

  const {
    code,
    createAt,
    subTotal,
    discount,
    tax,
    grandTotal,
    shippingAddressDTO,
    invoiceAddressDTO,
    shippingCost,
    contactName,
    contactPhone,
    shippingDetails,
    orderItemsDTO,
    couponDiscount,
  } = orderResult;

  const [logistics, trackingNumber] = shippingDetails
    ? shippingDetails.split(" : ")
    : "";

  return (
    <Modal show={show} onHide={handleClose} className="order-result">
      <Modal.Header closeButton>
        <Modal.Title>Siparişi Onayla</Modal.Title>
      </Modal.Header>
      <Modal.Body className="order-result-body">
        <div className="order-result-header">
          <p className="order-result-icon">
            <AiOutlineCheckCircle />
          </p>
          <p className="order-result-title">
            Siparişiniz başarıyla tamamlandı!
          </p>
          <p className="order-result-code">
            <b>Sipariş Numarası:</b> {code}
          </p>
        </div>
        <div className="order-result-details">
          <p>
            <b>Tarih :</b> {getDate(createAt)}
          </p>
          <p>
            <b>Saat :</b> {getTime(createAt)}
          </p>
          <p>
            <b>Kargo Adresi :</b> {shippingAddressDTO?.address}
          </p>
          <p>
            <b>Fatura Adresi :</b> {invoiceAddressDTO?.address}
          </p>
          <p>
            <b>İsim :</b> {contactName}
          </p>
          <p>
            <b>Telefon Numarası :</b> {contactPhone}
          </p>
          <p>
            <b>Kargo Şirketi :</b> {logistics}
          </p>
          <p>
            <b>Kargo Takip Numarası :</b> {trackingNumber}
          </p>
        </div>
        <Table responsive className="table align-middle">
          <thead>
            <tr>
              <th colSpan={2} className="text-start">
                Ürün
              </th>
              <th className="text-center">Amount</th>
              <th style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                Toplam
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItemsDTO?.map((product) => (
              <tr key={product.productId}>
                <td>
                  <img
                    src={`${settings.apiURL}/image/display/${product.imageId}`}
                    alt={product.productId}
                    width="50vh"
                  />
                </td>
                <td className="text-start">{product.title}</td>
                <td className="text-center">{product.quantity}</td>
                <td className="text-end">{product.subTotal.toFixed(2)}$</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-end">
                <b>Toplam :</b>
              </td>
              <td className="text-end">
                <b>{subTotal.toFixed(2)} TL</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="text-end">
                <b>İndirim :</b>
              </td>
              <td className="text-end">
                <b>{discount.toFixed(2)} TL</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="text-end">
                <b>Kupon İndirimi :</b>
              </td>
              <td className="text-end">
                <b>{couponDiscount.toFixed(2)} TL</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="text-end">
                <b>KDV :</b>
              </td>
              <td className="text-end">
                <b>{tax.toFixed(2)} TL</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="text-end">
                <b>Kargo Ücreti :</b>
              </td>
              <td className="text-end">
                <b>{shippingCost.toFixed(2)} TL</b>
              </td>
            </tr>

            <tr>
              <td colSpan={3} className="text-end">
                <b>Toplam Ücret :</b>
              </td>
              <td className="text-end">
                <b>{grandTotal.toFixed(2)} TL</b>
              </td>
            </tr>
          </tfoot>
        </Table>
        <p className="order-result-orders-link">
          Siparişinizi buradan{" "}
          <Link to="/user/orders"> takip edebilirsiniz</Link>!
        </p>
        <p className="order-result-thank-you">
          Alış Veriş yaptığınız için teşekkür ederiz!
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          style={{ borderRadius: "0.3rem", color: "white" }}
        >
          Kapat
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderResult;
