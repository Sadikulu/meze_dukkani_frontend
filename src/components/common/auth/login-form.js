import { Form, Button, InputGroup, Container, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { HiOutlineMail } from "react-icons/hi";
import * as Yup from "yup";
import PasswordInput from "../password-input/password-input";
import "./login-form.scss";
import { useState } from "react";
import { getUser, login } from "../../../api/user-service"; // login fonksiyonunu direkt import edin
import { toast } from "../../../helpers/functions/swal";
import { useAppDispatch } from "../../../store/hooks";
import { loginFailed, loginSuccess } from "../../../store/slices/auth-slice";
import { loadCart } from "../../../helpers/functions/cart-header"; // loadCart fonksiyonunu direkt import edin
import { setItems } from "../../../store/slices/favorite-slice";
import {
  encryptedLocalStorage,
  encryptedSessionStorage,
} from "../../../helpers/functions/encrypt-storage";
const LoginForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required("Please enter your email"),
    password: Yup.string().required("Please enter your password"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const respAuth = await login(values);
      localStorage.removeItem("cartUUID");
      sessionStorage.removeItem("cartUUID");
      const storage = rememberMe
        ? encryptedLocalStorage
        : encryptedSessionStorage;
      storage.setItem("token", respAuth.data.token);
      rememberMe
        ? localStorage.setItem("cartUUID", respAuth.data.cartUUID)
        : sessionStorage.setItem("cartUUID", respAuth.data.cartUUID);
      const respUser = await getUser();
      dispatch(loginSuccess(respUser.data));
      dispatch(setItems(respUser.data.favoriteList));
      await loadCart();
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
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
    <Container className="loginDiv">
      <Form noValidate onSubmit={formik.handleSubmit} className="p-4">
        <h3>GİRİŞ</h3>

        <InputGroup className="mb-3 mt-4">
          <InputGroup.Text>
            <HiOutlineMail />
          </InputGroup.Text>
          <Form.Control
            className="email-input"
            type="email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            isInvalid={formik.touched.email && formik.errors.email}
            isValid={formik.touched.email && !formik.errors.email}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.email}
          </Form.Control.Feedback>
        </InputGroup>

        <PasswordInput
          placeholder="Şifre"
          {...formik.getFieldProps("password")}
          isInvalid={formik.touched.password && formik.errors.password}
          isValid={formik.touched.password && !formik.errors.password}
          error={formik.errors.password}
        />

        <Form.Group
          className="mb-3 rememberForgot"
          controlId="formBasicCheckbox"
        >
          <Form.Check
            type="checkbox"
            label="Beni Hatırla"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link to="/forgot-password" style={{ textDecoration: "none" }}>
            <Form.Text className="forgotText">Şifremi Unuttum</Form.Text>
          </Link>
        </Form.Group>

        <Button
          variant="secondary"
          type="submit"
          disabled={!(formik.dirty && formik.isValid) || loading}
        >
          {loading && <Spinner animation="border" size="sm" />} Giriş Yap
        </Button>

        <hr className="mt-5" />

        <Form.Group className="mb-3">
          <Form.Text>Hesabınız yok mu?</Form.Text>
          <Form.Text onClick={() => navigate("/register")}>
            <span> &nbsp;Kayıt Ol!</span>
          </Form.Text>
        </Form.Group>

        <Button variant="light" onClick={() => navigate("/register")}>
          Kayıt Ol
        </Button>
      </Form>
    </Container>
  );
};

export default LoginForm;
