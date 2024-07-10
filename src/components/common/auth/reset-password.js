import { useFormik } from "formik";
import React from "react";
import { useState } from "react";
import { Button, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { toast } from "../../../helpers/functions/swal";
import PasswordInput from "../password-input/password-input";
import { RiShieldLine } from "react-icons/ri";
import "./reset-password.scss";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../../../api/user-service";

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token").slice(0, 36);

  //  FORMIK YAPISI

  const initialValues = {
    /*  resetCode: "",    */
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object({
    /*     resetCode: Yup.string().required(""), */
    newPassword: Yup.string()
      .required("Please enter your new password")
      .min(8, "Must be at least 8 characters")
      .matches(/[a-z]+/, "One lowercase character")
      .matches(/[A-Z]+/, "One uppercase character")
      .matches(/[@$!%*#?&.,]+/, "One special character")
      .matches(/\d+/, "One number"),
    confirmNewPassword: Yup.string()
      .required("Please re-enter your new password")
      .oneOf([Yup.ref("newPassword")], "Password fields don't match"),
  });

  const onSubmit = async (values) => {
    setLoading(true);

    // API BAGLANTILARI

    try {
      await resetPassword(token, values);
      toast("Şifre Güncellendi", "success");
      formik.resetForm();
      navigate("/login");
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
    <Container className="reset-password-container text-center">
      <Form className="p-4" noValidate onSubmit={formik.handleSubmit}>
        <h3>Şifre Sıfırla</h3>
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <RiShieldLine />
          </InputGroup.Text>
          <Form.Control
            placeholder="Şifreyi sıfırlamaya hazırsınız"
            disabled
            /*             placeholder="Reset Code"
            {...formik.getFieldProps("resetCode")}
            isInvalid={formik.touched.resetCode && formik.errors.resetCode}
            isValid={formik.touched.resetCode && !formik.errors.resetCode}
            error={formik.errors.resetCode} */
          />
        </InputGroup>
        <PasswordInput
          placeholder="Şifre"
          {...formik.getFieldProps("newPassword")}
          isInvalid={formik.touched.newPassword && formik.errors.newPassword}
          isValid={formik.touched.newPassword && !formik.errors.newPassword}
          error={formik.errors.newPassword}
        />
        <PasswordInput
          placeholder="Şifre Tekrar"
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
          className="submit-button"
          variant="secondary"
          type="submit"
          disabled={!(formik.dirty && formik.isValid) || loading}
        >
          {loading && <Spinner animation="border" size="sm" />} Şifre Sıfırla
        </Button>
        <hr className="mt-4" />

        <div className="mt-4">
          Bir hesabınız yok mu? <Link to={"/register"}>Kayıt Ol!</Link>
        </div>

        <div className="mt-3">
          Zaten kayıtlı mısınız? <Link to={"/login"}>Giriş Yap!</Link>
        </div>
      </Form>
    </Container>
  );
};

export default ResetPassword;
