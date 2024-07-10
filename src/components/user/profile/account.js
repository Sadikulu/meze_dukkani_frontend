import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Sidebar from "./sidebar";
import { toast } from "../../../helpers/functions/swal";
import { useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { HiOutlineMail } from "react-icons/hi";
import PasswordInput from "../../common/password-input/password-input";
import "./account.scss";
import { updatePassword } from "../../../api/user-service";

const Account = () => {
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);

  const { email } = user;

  const initialValues = {
    email,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Please enter your current password"),
    newPassword: Yup.string()
      .required("Please enter your new password")
      .min(8, "Must be at least 8 characters")
      .matches(/[a-z]+/, "One lowercase character")
      .matches(/[A-Z]+/, "One uppercase character")
      .matches(/[@$!%*#?&.]+/, "One special character")
      .matches(/\d+/, "One number"),
    confirmNewPassword: Yup.string()
      .required("Please re-enter your new password")
      .oneOf([Yup.ref("newPassword")], "Password fields doesn't match"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await updatePassword(values);
      toast("Password updated", "success");
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
    <Container className="account">
      <Row className="account-row">
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8} className="account-form p-5">
          <Form noValidate onSubmit={formik.handleSubmit}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <HiOutlineMail />
              </InputGroup.Text>
              <Form.Control
                className="email-input"
                type="email"
                {...formik.getFieldProps("email")}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </InputGroup>

            <PasswordInput
              placeholder="Eski Şifre"
              {...formik.getFieldProps("oldPassword")}
              isInvalid={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
              isValid={formik.touched.oldPassword && !formik.errors.oldPassword}
              error={formik.errors.oldPassword}
            />

            <PasswordInput
              placeholder="Yeni Şifre"
              {...formik.getFieldProps("newPassword")}
              isInvalid={
                formik.touched.newPassword && formik.errors.newPassword
              }
              isValid={formik.touched.newPassword && !formik.errors.newPassword}
              error={formik.errors.newPassword}
            />

            <PasswordInput
              placeholder="Yeni Şifre Tekrar"
              {...formik.getFieldProps("confirmNewPassword")}
              isInvalid={
                formik.touched.confirmNewPassword &&
                formik.errors.confirmNewPassword
              }
              isValid={
                formik.touched.confirmNewPassword &&
                !formik.errors.confirmNewPassword
              }
              error={formik.errors.confirmNewPassword}
            />

            <Button
              variant="secondary"
              type="submit"
              disabled={!(formik.dirty && formik.isValid) || loading}
            >
              {loading && <Spinner animation="border" size="sm" />} Kaydet
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
