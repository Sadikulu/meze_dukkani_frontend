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
import { HiOutlineMail } from "react-icons/hi";
import "./forgot-password.scss";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "../../../helpers/functions/swal";
import { useState } from "react";
import { forgotPassword } from "../../../api/user-service";
import { useEffect } from "react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [browser, setBrowser] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");

  function handleClick1() {
    navigate("/register");
  }

  function handleClick2() {
    navigate("/login");
  }

  let userAgentInfo = () => {
    var browserList = [
      { name: "Firefox", value: "firefox" },
      { name: "Opera", value: "OPR" },
      { name: "Edge", value: "Edge" },
      { name: "Chrome", value: "Chrome" },
      { name: "Safari", value: "Safari" },
    ];
    var os = [
      { name: "Android", value: "Android" },
      { name: "iPhone", value: "iPhone" },
      { name: "iPad", value: "Mac" },
      { name: "Macintosh", value: "Mac" },
      { name: "Linux", value: "Linux" },
      { name: "Windows", value: "Win" },
    ];
    let userDetails = navigator.userAgent;
    let browser = "";
    let operating = "";
    for (let i in browserList) {
      if (userDetails.includes(browserList[i].value)) {
        browser = browserList[i].name || "Unknown Browser";
        break;
      }
    }
    for (let i in os) {
      if (userDetails.includes(os[i].value)) {
        operating = os[i].name || "Unknown OS";
        break;
      }
    }
    setBrowser(browser);
    setOperatingSystem(operating);
  };

  useEffect(() => {
    window.onload = userAgentInfo();
  }, []);

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email().required("Lütfen mailinizi giriniz"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    const email = values.email;
    try {
      await forgotPassword({ email, operatingSystem, browser });
      navigate(`/forgot-reset?email=${values.email}`);
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
    <Container className="forgot text-center">
      <Row>
        <Col className="forgot-form">
          <Form
            noValidate
            onSubmit={formik.handleSubmit}
            className="frm p-1 mt-1"
          >
            <h3>Forgot Password</h3>

            <InputGroup className="mb-3 mt-4">
              <InputGroup.Text>
                <HiOutlineMail />
              </InputGroup.Text>

              <Form.Control
                className="input"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
                isInvalid={formik.touched.email && formik.errors.email}
                isValid={formik.touched.email && !formik.errors.email}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </InputGroup>

            <Button
              type="submit"
              variant="secondary"
              disabled={!(formik.dirty && formik.isValid) || loading}
            >
              {loading && <Spinner animation="border" size="sm" />} Kod Gönder
            </Button>

            <hr className="mt-4" />
            <Form.Group className="mb-3">
              <Form.Text>Hesabınız yok mu?</Form.Text>
              <Form.Text onClick={handleClick1}>
                <span> Kayıt Ol !</span>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Text>Bir hesabınız var mı?</Form.Text>
              <Form.Text onClick={handleClick2}>
                <span> Giriş Yap !</span>
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
