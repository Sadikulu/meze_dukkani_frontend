import React from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "../../../helpers/functions/swal";
import { useState } from "react";
import { sendMessage } from "../../../api/contact-service";

const ContactMessage = () => {
  const [loading, setLoading] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    body: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Isminizi Giriniz")
      .max(50, "The name should be the most 50 chars")
      .min(1, "The name should be at least 1 char"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Mailinizi Giriniz"),
    subject: Yup.string()
      .max(50, "The subject should be the most 50 chars")
      .min(5, "The subject should be at least 5 chars")
      .required("Konu Giriniz"),
    body: Yup.string()
      .max(200, "The message should the most 200 chars")
      .min(20, "The message should be at least 20 chars")
      .required("Mesajinizi Yaziniz"),
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      await sendMessage(values);
      formik.resetForm();
      toast("Mesajiniz başarıyla gönderildi", "success");
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
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>İsim</Form.Label>
        <Form.Control
          type="text"
          {...formik.getFieldProps("name")}
          isInvalid={formik.touched.name && !!formik.errors.name}
          isValid={formik.touched.name && !formik.errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          {...formik.getFieldProps("email")}
          isInvalid={formik.touched.email && !!formik.errors.email}
          isValid={formik.touched.email && !formik.errors.email}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Konu</Form.Label>
        <Form.Control
          type="text"
          {...formik.getFieldProps("subject")}
          isInvalid={formik.touched.subject && !!formik.errors.subject}
          isValid={formik.touched.subject && !formik.errors.subject}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.subject}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mesaj</Form.Label>
        <Form.Control
          type="text"
          as="textarea"
          rows="5"
          {...formik.getFieldProps("body")}
          isInvalid={formik.touched.body && !!formik.errors.body}
          isValid={formik.touched.body && !formik.errors.body}
        />
        <Form.Control.Feedback type="invalid">
          {formik.errors.body}
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        variant="secondary"
        type="submit"
        disabled={!(formik.dirty && formik.isValid) || loading}
      >
        {loading && <Spinner animation="border" size="sm" />} Gönder
      </Button>
    </Form>
  );
};

export default ContactMessage;
