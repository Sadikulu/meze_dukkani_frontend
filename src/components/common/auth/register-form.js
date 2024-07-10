import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import ReactInputMask from "react-input-mask-next";
import * as Yup from "yup";
import { HiOutlineMail } from "react-icons/hi";
import { BsTelephone, BsCreditCard } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import PasswordInput from "../password-input/password-input";
import { toast } from "../../../helpers/functions/swal";
import "./register.scss";
import { useNavigate } from "react-router-dom";
import { register } from "../../../api/user-service";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleClick() {
    navigate("/login");
  }

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
  };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Please enter your first name")
      .min(2, "Please enter 2 characters"),
    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "Please enter 2 characters"),
    email: Yup.string()
      .email("Plese enter a valid email address")
      .required("Please enter an email address"),
    password: Yup.string()
      .required("Please enter a password")
      .min(8, "Please provide at least 8 characters")
      .matches(/[a-z]+/, "One lowercase character")
      .matches(/[A-Z]+/, "One uppercase character")
      .matches(/[@$!%*#?&.]+/, "One special character")
      .matches(/\d+/, "One number"),
    confirmPassword: Yup.string()
      .required("Please re-enter your password")
      .oneOf([Yup.ref("password")], "Password fields dosen't match"),
    phone: Yup.string()
      .required("Please enter your phone number")
      .test(
        "is_includes_",
        "Please enter a valid phone number",
        (val) => val && !val.includes("_")
      ),
    birthDate: Yup.string()
      .required("Please enter your date")
      .min(8, "Must be at least 8 characters")
      .matches(/[0-9]+/, "Invalidat carchter")
      .matches(/[/-]+/, "One special character"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await register(values);
      toast("Kayıt Oldunuz", "success");
      navigate(`/register-mail?email=${values.email}`);
      formik.resetForm();
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
    <Container className="register-page">
      <Form noValidate onSubmit={formik.handleSubmit} className="p-4">
        <h3>KAYIT</h3>

        <InputGroup className="mb-3 mt-4">
          <InputGroup.Text>
            <BsCreditCard />
          </InputGroup.Text>
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
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsCreditCard />
          </InputGroup.Text>
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
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <BsTelephone />
          </InputGroup.Text>
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
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <MdDateRange />
          </InputGroup.Text>
          <Form.Control
            placeholder="Doğum Tarihi"
            type="text"
            as={ReactInputMask}
            mask="99-99-9999"
            {...formik.getFieldProps("birthDate")}
            isValid={formik.touched.birthDate && !formik.errors.birthDate}
            isInvalid={formik.touched.birthDate && !!formik.errors.birthDate}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.birthDate}
          </Form.Control.Feedback>
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroup.Text>
            <HiOutlineMail />
          </InputGroup.Text>
          <Form.Control
            placeholder="Email"
            type="email"
            {...formik.getFieldProps("email")}
            isValid={formik.touched.email && !formik.errors.email}
            isInvalid={formik.touched.email && !!formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </InputGroup>

        <PasswordInput
          className="passwordInput"
          placeholder="Şifre"
          {...formik.getFieldProps("password")}
          isValid={formik.touched.password && !formik.errors.password}
          isInvalid={formik.touched.password && !!formik.errors.password}
          error={formik.errors.password}
        />

        <PasswordInput
          className="passwordInput"
          placeholder="Şifre Tekrar"
          {...formik.getFieldProps("confirmPassword")}
          isValid={
            formik.touched.confirmPassword && !formik.errors.confirmPassword
          }
          isInvalid={
            formik.touched.confirmPassword && !!formik.errors.confirmPassword
          }
          error={formik.errors.confirmPassword}
        />

        <Button
          variant="secondary"
          type="submit"
          disabled={!(formik.dirty && formik.isValid) || loading}
        >
          {loading && <Spinner animation="border" size="sm" />} Kayıt Ol
        </Button>

        <hr className="mt-4" />

        <Form.Group className="mb-3">
          <Form.Text>Zaten bir hesabınız var mı?</Form.Text>
          <Form.Text onClick={handleClick}>
            <span> &nbsp;Giriş Yap!</span>
          </Form.Text>
        </Form.Group>

        <Button variant="light" onClick={handleClick} type="button">
          Giriş Yap
        </Button>
      </Form>
    </Container>
  );
};

export default RegisterForm;
