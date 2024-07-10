import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { useParams } from "react-router-dom";
import "./order-details.scss";
import {
  getOrdersById,
  updateToOrder,
  updateToOrderStatus,
} from "../../../api/order-service";
import { toast } from "../../../helpers/functions/swal";
import { settings } from "../../../helpers/setting";
import { getDate } from "../../../helpers/functions/date-time";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Loading from "../../common/loading/loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import AdminPageTitle from "../common/admin-page-title";
const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [quantityChanges, setQuantityChanges] = useState({});
  const [initialOrder, setInitialOrder] = useState({});
  const [initialQuantity, setInitialQuantity] = useState({});
  const initialValues = {
    status: order.status || "",
  };
  const validationSchema = Yup.object().shape({
    status: Yup.string(),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getOrdersById(orderId);
      setOrder(resp.data);
      setInitialOrder(resp.data);
      setInitialQuantity(
        resp.data.orderItemsDTO.reduce((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {})
      );
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (values) => {
    const status = values.status;
    try {
      await updateToOrderStatus(orderId, status);
      loadData();
      toast("Ürünün durumu güncellendi.", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
    validationSchema,
  });
  const plusToItemClick = (id) => {
    const currentQuantity =
      quantityChanges[id] ||
      order.orderItemsDTO.find((item) => item.productId === id).quantity;
    const maxQuantity = initialOrder.orderItemsDTO.find(
      (item) => item.productId === id
    ).quantity;
    const newQuantity = Math.min(currentQuantity + 1, maxQuantity);
    setQuantityChanges((prevState) => ({
      ...prevState,
      [id]: newQuantity,
    }));
    setOrder((prevOrder) => {
      const updatedOrderItems = prevOrder.orderItemsDTO.map((item) => {
        if (item.productId === id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      return {
        ...prevOrder,
        orderItemsDTO: updatedOrderItems,
      };
    });
  };
  const minusToItemClick = (id) => {
    setQuantityChanges((prevState) => {
      const prevQuantity =
        prevState[id] ||
        order.orderItemsDTO.find((item) => item.productId === id).quantity;
      return {
        ...prevState,
        [id]: Math.max(prevQuantity - 1, 0),
      };
    });
    setOrder((prevOrder) => {
      const updatedOrderItems = prevOrder.orderItemsDTO.map((item) => {
        if (item.productId === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
      return {
        ...prevOrder,
        orderItemsDTO: updatedOrderItems,
      };
    });
  };
  const removeItemFromOrder = (id) => {
    setQuantityChanges((prevState) => {
      const updatedChanges = { ...prevState };
      delete updatedChanges[id];
      return updatedChanges;
    });
    setOrder((prevOrder) => {
      const updatedItems = prevOrder.orderItemsDTO.filter(
        (item) => item.productId !== id
      );
      return {
        ...prevOrder,
        orderItemsDTO: updatedItems,
      };
    });
  };
  const orderChange = async () => {
    const updatedProducts = order?.orderItemsDTO?.map((ordered) => {
      const quantity = quantityChanges[ordered?.productId] || ordered?.quantity;
      return {
        productId: ordered?.productId,
        quantity: quantity,
      };
    });
    const requestBody = {
      orderId: order?.id,
      products: updatedProducts,
    };
    setUpdating(true);
    try {
      await updateToOrder(requestBody);
      loadData();
      toast("Sipariş güncellendi.", "success");
    } catch (error) {
      toast(error.response.data.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    formik.setValues({ status: order?.status || "" });
    handleQuantities();
    // eslint-disable-next-line
  }, [order]);

  const handleQuantities = () => {
    order?.orderItemsDTO?.map((item) => {
      const itemId = item?.productId;
      setQuantityChanges((prevState) => {
        const prevQuantity = item?.quantity;
        return {
          ...prevState,
          [itemId]: prevQuantity,
        };
      });
      return null;
    });
  };

  const orderDate = getDate(order?.createAt);
  const [logistics, trackingNumber] = order?.shippingDetails
    ? order?.shippingDetails?.split(" : ")
    : "";
  const updated = order?.updateAt !== null;

  return (
    <Container className="order-detail">
      <AdminPageTitle titleEdit={`${order?.code}`} />
      {loading ? (
        <Loading />
      ) : (
        <Row className="mt-5">
          <Col lg={4} className="order-left mb-3">
            <Form noValidate onSubmit={formik.handleSubmit}>
              <Form.Select type="text" {...formik.getFieldProps("status")}>
                <option value="PENDING">Askıda</option>
                <option value="BEING_SUPPLIED">Tedarik Ediliyor</option>
                <option value="READY_TO_SHIP">Gönderime Hazır</option>
                <option value="DELIVERY_DONE">Teslimat Tamamlandı</option>
                <option value="RETURNED">İade</option>
                <option value="CANCELED">İptal edildi</option>
              </Form.Select>
              <Button variant="secondary" type="submit">
                Durumu Ayarla
              </Button>
              <div className="order-detail-list">
                <Row>
                  <Col md={6} lg={12}>
                    <ul>
                      <li>
                        <b>Sipariş Kodu</b> <span>{order?.code}</span>
                      </li>
                      <li>
                        <b>Sipariş Tarihi</b> <span>{orderDate}</span>
                      </li>
                      <li>
                        <b>Kullanıcı</b> <span>{order?.customer}</span>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6} lg={12}>
                    <ul>
                      <li>
                        <b>İsim</b> <span>{order?.contactName}</span>
                      </li>
                      <li>
                        <b>Telefon Numarası</b>{" "}
                        <span>{order?.contactPhone}</span>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={6} lg={12}>
                    <ul>
                      <li>
                        {" "}
                        <b>Toplam</b> <span>{order?.subTotal?.toFixed(2)}</span>
                      </li>
                      <li>
                        <b>İndirim</b>{" "}
                        <span>{order?.discount?.toFixed(2)}</span>
                      </li>
                      {order?.couponDiscount > 0 ? (
                        <li>
                          <b>Kupon İndirimi</b>{" "}
                          <span>
                            {Number(order?.couponDiscount).toFixed(2)}
                          </span>
                        </li>
                      ) : (
                        ""
                      )}
                      <li>
                        <b>KDV</b> <span>{order?.tax?.toFixed(2)}</span>
                      </li>
                      <li>
                        <b>Kargo Ücreti</b>{" "}
                        <span>{order?.shippingCost?.toFixed(2)}</span>
                      </li>
                      <li>
                        <b>Genel Toplam</b>{" "}
                        <span>{order?.grandTotal?.toFixed(2)}</span>
                      </li>
                    </ul>
                  </Col>
                </Row>
                <hr />
              </div>
              <div className="shipping-details">
                <Row>
                  <div className="mb-3">
                    <b>Kargo Detayı</b>
                  </div>
                  <Col md={6} lg={12}>
                    <div>
                      <b>Kargo Şirketi</b>
                      <p>{logistics}</p>
                    </div>
                  </Col>
                  <Col md={6} lg={12}>
                    <div>
                      <b>Kargo Takip Numarası</b>
                      <p>{trackingNumber}</p>
                    </div>
                  </Col>
                  <Col md={6} lg={12}>
                    <div>
                      <b>Kargo Adresi</b>
                      <p>{order?.shippingAddressDTO?.address}</p>
                    </div>
                  </Col>
                  <Col md={6} lg={12}>
                    <div>
                      <b>Fatura Adresi</b>
                      <p>{order?.invoiceAddressDTO?.address}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Form>
          </Col>
          <Col lg={8} className="orders-table table-responsive">
            <Table
              striped
              className="align-middle table-hover overflow-y: scroll"
            >
              <thead>
                <tr>
                  <th>Resim</th>
                  <th>Ürün</th>
                  <th>Miktar</th>
                  <th>Birim Fiyatı</th>
                  <th>KDV</th>
                  <th>İndirim</th>
                  <th colSpan={2} style={{ whiteSpace: "nowrap" }}>
                    Toplam
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItemsDTO?.map((ordered, i) => {
                  const itemId = ordered?.productId;
                  const currentQuantity = quantityChanges[itemId];
                  const isMinQuantity = currentQuantity <= 1;
                  const isMaxQuantity =
                    currentQuantity >= initialQuantity[itemId];
                  const isLastItem =
                    order?.orderItemsDTO?.length === 1 ||
                    (order?.orderItemsDTO?.length === 1 &&
                      currentQuantity === 1);
                  return (
                    <tr key={i}>
                      <td>
                        <img
                          src={`${settings.apiURL}/image/display/${ordered?.imageId}`}
                          alt=""
                        />
                      </td>
                      <td>{ordered?.title}</td>
                      <td>
                        {!updated &&
                          !isMinQuantity &&
                          order.status !==
                            ("DELIVERY_DONE" || "RETURNED" || "CANCELED") && (
                            <AiOutlineMinusCircle
                              onClick={() => minusToItemClick(itemId)}
                            />
                          )}
                        <span>{currentQuantity}</span>
                        {!updated &&
                          !isMaxQuantity &&
                          order.status !==
                            ("DELIVERY_DONE" || "RETURNED" || "CANCELED") && (
                            <AiOutlinePlusCircle
                              onClick={() => plusToItemClick(itemId)}
                            />
                          )}
                      </td>
                      <td>{ordered?.unitPrice?.toFixed(2)} TL</td>
                      <td>
                        {(
                          (ordered?.tax / initialQuantity[itemId]) *
                          currentQuantity
                        ).toFixed(2)}{" "}
                        TL
                      </td>
                      <td>
                        {(
                          (ordered?.discount / initialQuantity[itemId]) *
                          currentQuantity
                        ).toFixed(2)}{" "}
                        TL
                      </td>
                      <td>
                        {(
                          ordered?.unitPrice * currentQuantity -
                          (ordered?.discount / initialQuantity[itemId]) *
                            currentQuantity +
                          (ordered?.tax / initialQuantity[itemId]) *
                            currentQuantity
                        ).toFixed(2)}{" "}
                        TL
                      </td>
                      <td>
                        {!updated &&
                          !isLastItem &&
                          order.status !==
                            ("DELIVERY_DONE" || "RETURNED" || "CANCELED") && (
                            <span onClick={() => removeItemFromOrder(itemId)}>
                              <BiTrash />
                            </span>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <div className="text-end update-btn">
              {!updated &&
                order.status !==
                  ("DELIVERY_DONE" || "RETURNED" || "CANCELED") && (
                  <Button
                    className="mt-5"
                    variant="primary"
                    type="submit"
                    disabled={updating}
                    onClick={() => {
                      orderChange();
                    }}
                  >
                    {updating && <Spinner animation="border" size="sm" />}{" "}
                    Güncelle
                  </Button>
                )}
            </div>
            {!updated &&
              order.status !==
                ("DELIVERY_DONE" || "RETURNED" || "CANCELED") && (
                <div className="alert">
                  <Alert variant="warning" className="mt-3">
                    Dikkat, söz konusu sipariş için yalnızca bir güncelleme
                    yapılabilir
                  </Alert>
                </div>
              )}
          </Col>
        </Row>
      )}
    </Container>
  );
};
export default OrderDetails;
