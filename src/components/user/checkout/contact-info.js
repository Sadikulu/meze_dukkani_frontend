import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Row, Col, Form, FormCheck, InputGroup } from "react-bootstrap";
import ReactInputMask from "react-input-mask-next";
import * as Yup from "yup";
import { AiOutlinePlus } from "react-icons/ai";
import "./contact-info.scss";
import InputMask from "react-input-mask-next";
import { checkExpireDate } from "../../../helpers/functions/date-time";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getUserAddresses } from "../../../api/address-service";
import { ordersCheckout } from "../../../api/order-service";
import { toast } from "../../../helpers/functions/swal";
import { getUserCouponCode } from "../../../api/coupon-service";
import { setCart } from "../../../store/slices/cart-slice";
import OrderResult from "./order-result";
import Loading from "../../common/loading/loading";
import ContactInfoAddNewAddress from "./contact-info-add-new-address";

const ContactInfo = ({
  loading,
  setLoading,
  setCouponDiscounted,
  setCouponNotDiscounted,
  setResetValues,
}) => {
  const { items } = useAppSelector((state) => state.cart);
  const [addressesData, setAddressesData] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [successPayment, setSuccessPayment] = useState(false);
  const [orderResult, setOrderResult] = useState("");
  const [show, setShow] = useState(false);
  const [addedNewAddress, setAddedNewAddress] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useAppDispatch();

  const initialValues = {
    contactName: "",
    phoneNumber: "",
    shippingAddressId: "",
    invoiceAddressId: "",
    cardNo: "",
    nameOnCard: "",
    expireDate: "",
    cvc: "",
    contract: false,
    couponCode: "",
  };

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Please enter your contact name"),
    phoneNumber: Yup.string()
      .required("Please enter your contact phone")
      .test(
        "includes_",
        "Please enter a valid phone number",
        (val) => val && !val.includes("_")
      ),
    shippingAddressId: Yup.string().required(
      "Please select a shipping address"
    ),
    invoiceAddressId: Yup.string().required("Please select a invoice address"),
    cardNo: Yup.string()
      .required("Please enter the card number")
      .test(
        "includes_",
        "Please enter a valid card number",
        (val) => val && !val.includes("_")
      ),
    nameOnCard: Yup.string().required("Please enter the name on the card"),
    expireDate: Yup.string()
      .required("Please enter the expire date")
      .test("month_check", "Enter a valid expire date (MM/YY)", (val) =>
        checkExpireDate(val)
      ),
    cvc: Yup.number()
      .typeError("Must be number")
      .required()
      .min(1)
      .max(999, "Please enter CVC"),
    contract: Yup.boolean().oneOf(
      [true],
      "Please read the contract and check the box"
    ),
  });

  const loadData = async () => {
    try {
      const resp = await getUserAddresses();
      setAddressesData(resp.data);
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  const subTotal = items
    .reduce((total, item) => (total += item.quantity * item.unitPrice), 0)
    .toFixed(2);

  const tax = items
    .reduce(
      (total, index) =>
        (total += (index.discountedPrice * index.quantity * index.tax) / 100),
      0
    )
    .toFixed(2);

  const discounts = items
    .reduce(
      (item, index) =>
        (item += Number(
          (index.quantity * index.unitPrice * index.discount) / 100
        )),
      0
    )
    .toFixed(2);

  const onSubmitCouponCode = async () => {
    setLoading(true);
    try {
      const resp = await getUserCouponCode(formik.values.couponCode);
      setCoupon(resp.data);
      let message =
        resp.data.type === "EXACT_AMOUNT"
          ? `${resp.data.amount}$ discount has been applied`
          : `${resp.data.amount}% discount has been applied`;
      toast(message, "success");
      const grandTotalAddCoupon = formik.values.couponCode
        ? resp.data.type === "EXACT_AMOUNT"
          ? (
              Number(subTotal) -
              Number(discounts) +
              Number(tax) -
              Number(resp.data.amount)
            ).toFixed(2)
          : (
              Number(subTotal) -
              Number(discounts) +
              Number(tax) -
              (Number(subTotal) - Number(discounts) + Number(tax)) *
                (Number(resp.data.amount) / 100)
            ).toFixed(2)
        : (Number(subTotal) - Number(discounts) + Number(tax)).toFixed(2);

      let shippingPrice = 0;
      if (
        Number(grandTotalAddCoupon) <= 0 ||
        Number(grandTotalAddCoupon) === undefined
      ) {
        shippingPrice = 0;
      } else if (Number(grandTotalAddCoupon) <= 750) {
        shippingPrice = 5;
      } else if (Number(grandTotalAddCoupon) <= 1500) {
        shippingPrice = 15;
      } else if (Number(grandTotalAddCoupon) <= 3000) {
        shippingPrice = 25;
      } else if (Number(grandTotalAddCoupon) <= 5000) {
        shippingPrice = 35;
      } else {
        shippingPrice = 0;
      }

      setGrandTotal(
        Number(Number(grandTotalAddCoupon) + Number(shippingPrice)).toFixed(2)
      );
      setCouponDiscounted(Number(grandTotalAddCoupon));
    } catch (err) {
      toast(err.response.data.message, "error");
      formik.values.couponCode = "";
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    const dto = {
      contactName: values.contactName,
      phoneNumber: values.phoneNumber,
      shippingAddressId: values.shippingAddressId,
      invoiceAddressId: values.invoiceAddressId,
      couponCode: values.couponCode,
    };
    setLoading(true);
    try {
      const resp = await ordersCheckout(dto);
      setOrderResult(resp.data.data);
      formik.resetForm();
      dispatch(setCart([]));
      setSuccessPayment(true);
      setResetValues(true);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    loadData();
    const grandTotalInitial = Number(
      Number(subTotal) - Number(discounts) + Number(tax)
    ).toFixed(2);
    let shippingPrice = 0;
    if (
      Number(grandTotalInitial) <= 0 ||
      Number(grandTotalInitial) === undefined
    ) {
      shippingPrice = 0;
    } else if (Number(grandTotalInitial) <= 750) {
      shippingPrice = 5;
    } else if (Number(grandTotalInitial) <= 1500) {
      shippingPrice = 15;
    } else if (Number(grandTotalInitial) <= 3000) {
      shippingPrice = 25;
    } else if (Number(grandTotalInitial) <= 5000) {
      shippingPrice = 35;
    } else {
      shippingPrice = 0;
    }
    setGrandTotal(Number(Number(grandTotalInitial) + Number(shippingPrice)));
    setCouponNotDiscounted(Number(grandTotalInitial));
    // eslint-disable-next-line
  }, [items, discounts, subTotal, tax, addedNewAddress]);

  const isInvalid = (field) => {
    return formik.touched[field] && formik.errors[field];
  };

  const isValid = (field) => {
    return formik.touched[field] && !formik.errors[field];
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="contact-info">
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Row>
          <Col sm={12} md={6} className="contact-information">
            <h2>İletişim Bilgileri</h2>
            <InputGroup className="my-3">
              <Form.Control
                type="text"
                placeholder="İsim"
                {...formik.getFieldProps("contactName")}
                isInvalid={isInvalid("contactName")}
                isValid={isValid("contactName")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.contactName}
              </Form.Control.Feedback>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Telefon Numarası"
                as={ReactInputMask}
                mask="(999) 999-9999"
                {...formik.getFieldProps("phoneNumber")}
                isInvalid={isInvalid("phoneNumber")}
                isValid={isValid("phoneNumber")}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phoneNumber}
              </Form.Control.Feedback>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Select
                {...formik.getFieldProps("shippingAddressId")}
                isInvalid={isInvalid("shippingAddressId")}
                isValid={isValid("shippingAddressId")}
              >
                <option value="">Kargo Adresi</option>
                {addressesData.map((address) => {
                  return (
                    <option
                      className="py-2"
                      value={address.id}
                      key={address.id}
                    >
                      {address.title}
                    </option>
                  );
                })}
              </Form.Select>
              <InputGroup.Text>
                <AiOutlinePlus onClick={handleShow} />
                <ContactInfoAddNewAddress
                  show={show}
                  handleClose={handleClose}
                  setAddedNewAddress={setAddedNewAddress}
                />
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {formik.errors.shippingAddressId}
              </Form.Control.Feedback>
            </InputGroup>

            <InputGroup className="mb-3">
              <Form.Select
                {...formik.getFieldProps("invoiceAddressId")}
                isInvalid={isInvalid("invoiceAddressId")}
                isValid={isValid("invoiceAddressId")}
              >
                <option value="">Fatura Adresi</option>
                {addressesData.map((address) => {
                  return (
                    <option
                      className="py-2"
                      value={address.id}
                      key={address.id}
                    >
                      {address.title}
                    </option>
                  );
                })}
              </Form.Select>
              <InputGroup.Text>
                <AiOutlinePlus onClick={handleShow} />
                <ContactInfoAddNewAddress
                  show={show}
                  handleClose={handleClose}
                  setAddedNewAddress={setAddedNewAddress}
                />
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {formik.errors.invoiceAddressId}
              </Form.Control.Feedback>
            </InputGroup>
          </Col>

          <Col sm={12} md={6} className="credit-form">
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Kupon Kodu"
                {...formik.getFieldProps("couponCode")}
              />
              <InputGroup.Text className="p-0">
                <Button
                  variant="light"
                  onClick={onSubmitCouponCode}
                  disabled={
                    coupon.code === formik.values.couponCode &&
                    coupon.status === "ACTIVE"
                  }
                >
                  Uygula
                </Button>
              </InputGroup.Text>
            </InputGroup>
            <h2>TOPLAM : {Number(grandTotal).toFixed(2)} TL</h2>

            <Form.Control
              className="mb-3"
              type="text"
              placeholder="Kartta Yazan İsim"
              {...formik.getFieldProps("nameOnCard")}
              isInvalid={isInvalid("nameOnCard")}
              isValid={isValid("nameOnCard")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.nameOnCard}
            </Form.Control.Feedback>

            <Form.Control
              className="mb-3"
              type="text"
              placeholder="Kart Numarası"
              as={InputMask}
              mask="9999-9999-9999-9999"
              {...formik.getFieldProps("cardNo")}
              isInvalid={isInvalid("cardNo")}
              isValid={isValid("cardNo")}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.cardNo}
            </Form.Control.Feedback>

            <div>
              <Row>
                <Col md={8}>
                  <Form.Control
                    className=" mb-3"
                    type="text"
                    as={InputMask}
                    mask="99/99"
                    placeholder="SKT"
                    {...formik.getFieldProps("expireDate")}
                    isInvalid={isInvalid("expireDate")}
                    isValid={isValid("expireDate")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.expireDate}
                  </Form.Control.Feedback>
                </Col>

                <Col md={4}>
                  <Form.Control
                    className=" mb-3"
                    type="password"
                    as={InputMask}
                    mask="999"
                    placeholder="CVC Kodu"
                    {...formik.getFieldProps("cvc")}
                    isInvalid={isInvalid("cvc")}
                    isValid={isValid("cvc")}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.cvc}
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </div>

            <FormCheck
              type="checkbox"
              id="contract"
              label="Satış sözleşmesini okudum, anladım ve kabul ediyorum"
              {...formik.getFieldProps("contract")}
              isInvalid={isInvalid("contract")}
              isValid={isValid("contract")}
            />

            <Button
              className="mt-3 w-100"
              variant="secondary"
              type="submit"
              disabled={!(formik.dirty && formik.isValid)}
            >
              Ödeme Yap
            </Button>
          </Col>
        </Row>
      </Form>
      {successPayment ? <OrderResult orderResult={orderResult} /> : ""}
    </div>
  );
};

export default ContactInfo;
