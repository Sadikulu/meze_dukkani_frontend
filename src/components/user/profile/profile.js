import React, { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import Sidebar from "./sidebar";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "../../../helpers/functions/swal";
import ReactInputMask from "react-input-mask-next";
import "./profile.scss";
import { HiOutlineMail } from "react-icons/hi";
import { BsTelephone, BsCreditCard } from "react-icons/bs";
import { MdDateRange } from "react-icons/md";
import { updateUser } from "../../../api/user-service";
import { useAppSelector } from "../../../store/hooks";
import { getDateDayMountYear } from "../../../helpers/functions/date-time";
const Profile = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const { firstName, lastName, phone, email, birthDate } = user;

  const initialValues = {
    firstName,
    lastName,
    phone,
    birthDate,
    email,
  };
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Please enter your name")
      .min(2, "Must be at least 2 characters")
      .max(30, "Must be the most 30 characters"),
    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "Must be at least 2 characters")
      .max(30, "Must be the most 30 characters"),
    phone: Yup.string()
      .required()
      .test(
        "includes_",
        "Please enter phone number",
        (value) => value && !value.includes("_")
      ),
    birthDate: Yup.string()
      .required("Please enter your date")
      .min(8, "Must be at least 8 characters")
      .matches(/[0-9]+/, "Invalidat carchter")
      .matches(/[/-]+/, "One special character"),
    email: Yup.string()
      .email()
      .required("Please enter your email")
      .min(10, "Must be at least 10 characters")
      .max(80, "Must be the most 80 characters"),
  });
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const birthday = getDateDayMountYear(values.birthDate);
      delete values.birthDate;
      await updateUser({ ...values, birthDate: birthday });
      toast("Profil başarıyla güncellendi", "success");
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
    <Container className="profile">
      <Row className="profile-row">
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8} className="profile-page">
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <InputGroup className="mb-1">
                <InputGroup.Text>
                  <BsCreditCard />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("firstName")}
                  isInvalid={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  isValid={formik.touched.firstName && !formik.errors.firstName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.firstName}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Control.Feedback type="invalid">
              {formik.errors.firstName}
            </Form.Control.Feedback>
            <Form.Group className="mb-3">
              <InputGroup className="mb-1">
                <InputGroup.Text>
                  <BsCreditCard />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  {...formik.getFieldProps("lastName")}
                  isInvalid={formik.touched.lastName && formik.errors.lastName}
                  isValid={formik.touched.lastName && !formik.errors.lastName}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.lastName}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup className="mb-1">
                <InputGroup.Text>
                  <BsTelephone />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  as={ReactInputMask}
                  mask="(999) 999-9999"
                  {...formik.getFieldProps("phone")}
                  isInvalid={formik.touched.phone && formik.errors.phone}
                  isValid={formik.touched.phone && !formik.errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup className="mb-1">
                <InputGroup.Text>
                  <MdDateRange />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  as={ReactInputMask}
                  mask="9999-99-99"
                  {...formik.getFieldProps("birthDate")}
                  isInvalid={
                    formik.touched.birthDate && formik.errors.birthDate
                  }
                  isValid={formik.touched.birthDate && !formik.errors.birthDate}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.birthDate}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <InputGroup className="mb-1">
                <InputGroup.Text>
                  <HiOutlineMail />
                </InputGroup.Text>
                <Form.Control
                  type="email"
                  {...formik.getFieldProps("email")}
                  isInvalid={formik.touched.email && formik.errors.email}
                  isValid={formik.touched.email && !formik.errors.email}
                  disabled
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.email}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <div className="text-center">
              <Button
                variant="secondary"
                type="submit"
                disabled={!(formik.dirty && formik.isValid) || loading}
              >
                {loading && <Spinner animation="border" size="sm" />} Kaydet
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Profile;
