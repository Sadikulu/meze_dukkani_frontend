import { useFormik } from "formik";
import React from "react";
import { Button, ButtonGroup, Form } from "react-bootstrap";
import ReactInputMask from "react-input-mask-next";
import * as Yup from "yup";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import "./edit-address-form.scss";

const EditAddressForm = ({ userAddress, onCancelEdit, onUpdateAddress }) => {
  const {
    id,
    title,
    firstName,
    lastName,
    email,
    address,
    province,
    city,
    country,
    phone,
  } = userAddress;

  const initialValues = {
    id,
    title,
    firstName,
    lastName,
    phone,
    email,
    address,
    province,
    city,
    country,
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Please enter the title")
      .max(30, "Please enter the most 30 characters"),
    firstName: Yup.string()
      .required("Please enter your first name")
      .min(2, "Please enter 2 characters")
      .max(30, "Please enter the most 30 characters"),
    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "Please enter 2 characters")
      .max(30, "Please enter the most 30 characters"),
    email: Yup.string()
      .email("Plese enter a valid email address")
      .required("Please enter an email address")
      .min(10, "Please enter 10 characters")
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
      .min(10, "Please enter 10 characters")
      .max(250, "Please enter the most 250 characters"),
    province: Yup.string()
      .required("Please enter your province")
      .min(2, "Please enter 2 characters")
      .max(70, "Please enter the most 70 characters"),
    city: Yup.string()
      .required("Please enter your city")
      .min(2, "Please enter 2 characters")
      .max(70, "Please enter the most 70 characters"),
    country: Yup.string()
      .required("Please enter your country")
      .min(2, "Please enter 2 characters")
      .max(70, "Please enter the most 70 characters"),
  });

  const onSubmit = () => {
    const updatedAddress = { ...formik.values, userAddress: initialValues };
    onUpdateAddress(updatedAddress);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <Form onSubmit={formik.handleSubmit} className="edit-address-form">
      <Form.Group>
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

      <Form.Group>
        <Form.Control
          placeholder="İsim"
          type="text"
          {...formik.getFieldProps("firstName")}
          isValid={formik.touched.firstName && !formik.errors.firstName}
          isInvalid={formik.touched.firstName && !!formik.errors.firstName}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.firstName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Control
          placeholder="Soyisim"
          type="text"
          {...formik.getFieldProps("lastName")}
          isValid={formik.touched.lastName && !formik.errors.lastName}
          isInvalid={formik.touched.lastName && !!formik.errors.lastName}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.lastName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Control
          placeholder="Email"
          type="text"
          {...formik.getFieldProps("email")}
        />
      </Form.Group>

      <Form.Group>
        <Form.Control
          placeholder="Telefon No"
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

      <Form.Group>
        <Form.Control
          placeholder="Adres"
          type="text"
          {...formik.getFieldProps("address")}
          isValid={formik.touched.address && !formik.errors.address}
          isInvalid={formik.touched.address && !!formik.errors.address}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.address}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Control
          placeholder="Mahalle"
          type="text"
          {...formik.getFieldProps("province")}
          isValid={formik.touched.province && !formik.errors.province}
          isInvalid={formik.touched.province && !!formik.errors.province}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.province}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
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

      <Form.Group>
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

      <div className="text-end">
        <ButtonGroup>
          <Button variant="primary" type="submit">
            <MdCheckCircle />
          </Button>
          <Button variant="secondary" type="button" onClick={onCancelEdit}>
            <MdCancel />
          </Button>
        </ButtonGroup>
      </div>
    </Form>
  );
};

export default EditAddressForm;
