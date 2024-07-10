import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  Form,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { question, toast } from "../../../helpers/functions/swal";
import "./category-edit.scss";
import * as Yup from "yup";
import {
  deleteCategoryById,
  getCategoryById,
  updateCategoryById,
} from "../../../api/category-service";
import AdminPageTitle from "../common/admin-page-title";

const CategoryEdit = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const { categoryId } = useParams();

  const [initialValues, setInitialValues] = useState({
    title: "",
    status: "",
    builtIn: false,
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Please enter the title")
      .min(2, "Please enter at least 2 characters")
      .max(80, "Please enter the most 80 characters"),
  });

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      await updateCategoryById(categoryId, values);
      toast("Kategori Kaydedildi", "success");
      navigate(-1);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const loadData = async () => {
    try {
      const resp = await getCategoryById(categoryId);
      setInitialValues(resp.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const removeCategory = async () => {
    setDeleting(true);
    try {
      await deleteCategoryById(categoryId);
      toast("Kategori Silindi", "success");
      navigate(-1);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    question("Silmek istediğinize emin misiniz?", "Geri dönüş yok!").then(
      (result) => {
        if (result.isConfirmed) {
          removeCategory();
        }
      }
    );
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const categoryTitle = formik.values.title
    .slice(0, 1)
    .toLocaleUpperCase()
    .concat(
      formik.values.title
        .slice(1, formik.values.title.length)
        .toLocaleLowerCase()
    );

  return (
    <Container className="category-edit">
      <AdminPageTitle titleEdit={categoryTitle} />
      <Form noValidate onSubmit={formik.handleSubmit} className="mt-5">
        <fieldset disabled={formik.values.builtIn}>
          <Form.Group className="mb-4">
            <Form.Label>Başlık</Form.Label>
            <Form.Control
              type="text"
              {...formik.getFieldProps("title")}
              isValid={formik.touched.title && !formik.errors.title}
              isInvalid={formik.touched.title && !!formik.errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-5">
            <Form.Check
              type="switch"
              label="Active"
              checked={formik.values.status === "PUBLISHED"}
              onChange={(e) =>
                formik.setFieldValue(
                  "status",
                  e.target.checked ? "PUBLISHED" : "NOT_PUBLISHED"
                )
              }
              // isValid={formik.touched.status && !formik.errors.status}
              // isInvalid={formik.touched.status && !!formik.errors.status}
              // feedback={formik.errors.status}
              // feedbackType="invalid"
            />
          </Form.Group>

          <div className="text-end">
            <ButtonGroup className="mt-5">
              <Button
                onClick={handleDelete}
                disabled={deleting}
                variant="secondary"
              >
                {deleting && <Spinner animation="border" size="sm" />} Sil
              </Button>
              <Button
                variant="primary"
                type="submit"
                // disabled={!(formik.dirty && formik.isValid) || loading}
                disabled={updating}
              >
                {updating && <Spinner animation="border" size="sm" />} Güncelle
              </Button>
            </ButtonGroup>
          </div>
        </fieldset>
      </Form>
      {formik.values.builtIn && (
        <div className="alert">
          <Alert variant="danger" className="mt-5">
            Built-in kategori silinemez veya güncellenemez
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default CategoryEdit;
