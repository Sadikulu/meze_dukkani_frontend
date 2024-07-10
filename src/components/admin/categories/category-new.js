import { useFormik } from "formik";
import React, { useState } from "react";
import { Button, ButtonGroup, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { newCategory } from "../../../api/category-service";
import { toast } from "../../../helpers/functions/swal";
import "./category-new.scss";
import AdminPageTitle from "../common/admin-page-title";

const CategoryNew = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Lütfen başlik girin")
      .min(2, "Lütfen en az 2 karakter girin")
      .max(80, "Lütfen en fazla 80 karakter girin"),
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await newCategory(values);
      toast("Kategori oluşturuldu", "success");
      navigate(-1);
    } catch (err) {
      console.error("Error:", err);
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Bir hata oluştu.";
      toast(errorMessage, "error");
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
    <Container className="category-new">
      <AdminPageTitle />
      <Form noValidate onSubmit={formik.handleSubmit} className="mt-5">
        <Form.Group className="mb-4">
          <Form.Label>Başlık</Form.Label>
          <Form.Control
            placeholder="Bir şeyler yazınız"
            type="text"
            {...formik.getFieldProps("title")}
            isValid={formik.touched.title && !formik.errors.title}
            isInvalid={formik.touched.title && !!formik.errors.title}
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.title}
          </Form.Control.Feedback>
        </Form.Group>

        <div className="text-end">
          <ButtonGroup className="mt-5">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!(formik.dirty && formik.isValid) || loading}
            >
              {loading && <Spinner animation="border" size="sm" />} Oluştur
            </Button>
          </ButtonGroup>
        </div>
      </Form>
    </Container>
  );
};

export default CategoryNew;
