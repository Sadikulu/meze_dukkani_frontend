import React from "react";
import { Button, Col, Form, Offcanvas, Row, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import ReactInputMask from "react-input-mask-next";
import { toast } from "../../../helpers/functions/swal";
import { newAddress } from "../../../api/address-service";
import "../profile/new-address-form.scss";
import { useState } from "react";

const ContactInfoAddNewAddress = ({
  show,
  handleClose,
  setAddedNewAddress,
}) => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    city: "",
    country: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Please enter the title")
      .max(30, "Please enter the most 30 characters"),
    firstName: Yup.string()
      .required("Please enter your first name")
      .min(2, "Please enter at least 2 characters")
      .max(30, "Please enter the most 30 characters"),
    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "Please enter at least 2 characters")
      .max(30, "Please enter the most 30 characters"),
    email: Yup.string()
      .email("Plese enter a valid email address")
      .required("Please enter an email address")
      .min(10, "Please enter at least 10 characters")
      .max(80, "Please enter the most 80 characters"),
    phone: Yup.string()
      .required("Please enter your phone number")
      .test(
        "is_includes_",
        "Please enter a valid phone number",
        (val) => val && !val.includes("_")
      ),
    address: Yup.string()
      .required("Please enter your address")
      .min(10, "Please enter at least 10 characters")
      .max(250, "Please enter the most 250 characters"),
    province: Yup.string()
      .required("Please enter your province")
      .min(2, "Please enter at least 2 characters")
      .max(70, "Please enter the most 70 characters"),
    city: Yup.string()
      .required("Please enter your city")
      .min(2, "Please enter at least 2 characters")
      .max(70, "Please enter the most 70 characters"),
    country: Yup.string()
      .required("Please enter your country")
      .min(2, "Please enter at least 2 characters")
      .max(70, "Please enter the most 70 characters"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await newAddress(values);
      toast("Your new address has been added", "success");
      setAddedNewAddress(true);
      formik.resetForm();
      handleClose();
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

  return (
    <section className="new-address-form">
      <Offcanvas
        show={show}
        onHide={handleClose}
        className="new-address-form-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Yeni Adres</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Row className="row-cols-1">
              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Başlık"
                  type="text"
                  {...formik.getFieldProps("title")}
                  isValid={formik.touched.title && !formik.errors.title}
                  isInvalid={formik.touched.title && !!formik.errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.title}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="İsim"
                  type="text"
                  {...formik.getFieldProps("firstName")}
                  isValid={formik.touched.firstName && !formik.errors.firstName}
                  isInvalid={
                    formik.touched.firstName && !!formik.errors.firstName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Soyisim"
                  type="text"
                  {...formik.getFieldProps("lastName")}
                  isValid={formik.touched.lastName && !formik.errors.lastName}
                  isInvalid={
                    formik.touched.lastName && !!formik.errors.lastName
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Email"
                  type="text"
                  {...formik.getFieldProps("email")}
                />
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Tel No"
                  type="text"
                  as={ReactInputMask}
                  mask="(999)-999-9999"
                  {...formik.getFieldProps("phone")}
                  isValid={formik.touched.phone && !formik.errors.phone}
                  isInvalid={formik.touched.phone && !!formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Adres"
                  as="textarea"
                  rows={3}
                  {...formik.getFieldProps("address")}
                  isValid={formik.touched.address && !formik.errors.address}
                  isInvalid={formik.touched.address && !!formik.errors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Mahalle"
                  type="text"
                  {...formik.getFieldProps("province")}
                  isValid={formik.touched.province && !formik.errors.province}
                  isInvalid={
                    formik.touched.province && !!formik.errors.province
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.province}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="İlçe"
                  type="text"
                  {...formik.getFieldProps("city")}
                  isValid={formik.touched.city && !formik.errors.city}
                  isInvalid={formik.touched.city && !!formik.errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" as={Col}>
                <Form.Control
                  placeholder="Şehir"
                  type="text"
                  {...formik.getFieldProps("country")}
                  isValid={formik.touched.country && !formik.errors.country}
                  isInvalid={formik.touched.country && !!formik.errors.country}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.country}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <div className="text-end">
              <Button
                variant="secondary"
                type="submit"
                disabled={!(formik.dirty && formik.isValid) || loading}
              >
                {loading && <Spinner animation="border" size="sm" />} Ekle
              </Button>
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </section>
  );
};

export default ContactInfoAddNewAddress;
