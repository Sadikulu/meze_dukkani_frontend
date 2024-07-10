import React from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { question, toast } from "../../../helpers/functions/swal";
import ReactInputMask from "react-input-mask-next";
import Loading from "../../common/loading/loading";
import { useEffect } from "react";
import "./admin-user-edit-1.scss";
import {
  deleteUserById,
  getUserById,
  updateUserById,
} from "../../../api/user-service";
import PasswordInput from "../../common/password-input/password-input";
import { useAppSelector } from "../../../store/hooks";
import AdminPageTitle from "../common/admin-page-title";
import { getDateDayMountYear } from "../../../helpers/functions/date-time";

const AdminUserEdit1 = () => {
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const justManager =
    user.roles.includes("Manager") && !user.roles.includes("Administrator");

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    birthDate: "",
    email: "",
    password: "",
    status: "",
    roles: [], // birden fazla rol atanabilir.
    builtIn: false,
  });

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("Please enter your first name")
      .min(2, "min 2 characters")
      .max(30, "max 30 characters"),
    lastName: Yup.string()
      .required("Please enter your last name")
      .min(2, "min 2 characters")
      .max(30, "max 30 characters"),
    password: Yup.string()
      .min(8, "Please provide at least 8 characters")
      .matches(/[a-z]+/, "One lowercase character")
      .matches(/[A-Z]+/, "One uppercase character")
      .matches(/[@$!%*#?&.]+/, "One special character")
      .matches(/\d+/, "One number"),
    phone: Yup.string()
      .required("Please enter your phone number")
      .test(
        "is_includes_",
        "Please enter a valid phone number",
        (val) => val && !val.includes("_")
      ),
    email: Yup.string()
      .email("Plese enter a valid email address")
      .required("Please enter an email address"),
    birthDate: Yup.string().required(8, "Please enter your date of birth"),
    roles: Yup.array().test(
      "role_check",
      "Please select a role",
      (val) => val.length > 0
    ),
  });

  const onSubmit = async (values) => {
    if (!values.password) {
      delete values.password;
    }
    setUpdating(true);
    try {
      await updateUserById(userId, values);
      toast("Kullanıcı Başarıyla Güncellendi", "success");
      navigate(-1);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getUserById(userId);
      const birthday = getDateDayMountYear(resp.data.birthDate);
      setInitialValues({ ...resp.data, password: "", birthDate: birthday });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async () => {
    setDeleting(true);
    try {
      await deleteUserById(userId);
      toast("Kullanıcı Silindi", "success");
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
          removeUser();
        }
      }
    );
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const statusAnonymous = formik.values.status === "ANONYMOUS";

  return loading ? (
    <Loading />
  ) : (
    <Container className="admin-user-edit-1">
      <AdminPageTitle
        titleEdit={`${formik.values.firstName} ${formik.values.lastName}`}
      />
      <Form noValidate onSubmit={formik.handleSubmit}>
        <fieldset
          disabled={formik.values.builtIn || justManager || statusAnonymous}
        >
          <Row className="row-cols-1 row-cols-sm-2 mt-5">
            <Form.Group as={Col} className="mb-3">
              <Form.Label>İsim</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("firstName")}
                isValid={formik.touched.firstName && !formik.errors.firstName}
                isInvalid={
                  formik.touched.firstName && !!formik.errors.firstName
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>Soyisim</Form.Label>
              <Form.Control
                type="text"
                {...formik.getFieldProps("lastName")}
                isValid={formik.touched.lastName && !formik.errors.lastName}
                isInvalid={formik.touched.lastName && !!formik.errors.lastName}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <PasswordInput
                {...formik.getFieldProps("password")}
                isValid={formik.touched.password && !formik.errors.password}
                isInvalid={formik.touched.password && !!formik.errors.password}
                error={formik.errors.password}
              />
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>Telefon Numarası</Form.Label>
              <Form.Control
                type="text"
                as={ReactInputMask}
                mask="(999) 9999999"
                {...formik.getFieldProps("phone")}
                isValid={formik.touched.phone && !formik.errors.phone}
                isInvalid={formik.touched.phone && !!formik.errors.phone}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.phone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                {...formik.getFieldProps("email")}
                isValid={formik.touched.email && !formik.errors.email}
                isInvalid={formik.touched.email && !!formik.errors.email}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group as={Col} className="mb-3">
              <Form.Label>Doğum Tarihi</Form.Label>
              <Form.Control
                type="text"
                as={ReactInputMask}
                mask="99-99-9999"
                {...formik.getFieldProps("birthDate")}
                isValid={formik.touched.birthDate && !formik.errors.birthDate}
                isInvalid={
                  formik.touched.birthDate && !!formik.errors.birthDate
                }
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.birthDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Row>
                <Col sm={2} className="me-4">
                  <Form.Check
                    label="User"
                    type="checkbox"
                    name="roles"
                    value="Customer"
                    checked={formik.values.roles.includes("Customer")}
                    onChange={formik.handleChange}
                    isValid={formik.touched.roles && !formik.errors.roles}
                    isInvalid={formik.touched.roles && !!formik.errors.roles}
                  />
                </Col>

                <Col sm={2}>
                  <Form.Check
                    label="Admin"
                    type="checkbox"
                    name="roles"
                    value="Administrator"
                    checked={formik.values.roles.includes("Administrator")}
                    onChange={formik.handleChange}
                    isValid={formik.touched.roles && !formik.errors.roles}
                    isInvalid={formik.touched.roles && !!formik.errors.roles}
                    feedback={formik.errors.roles}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Row>
          <div className="text-end">
            <ButtonGroup className="mt-5">
              <Button
                variant="secondary"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Spinner animation="border" size="sm" />} Sil
              </Button>
              <Button variant="primary" type="submit" disabled={updating}>
                {updating && <Spinner animation="border" size="sm" />} Güncelle
              </Button>
            </ButtonGroup>
          </div>
          {formik.values.builtIn && (
            <div className="alert">
              <Alert variant="danger" className="mt-3">
                Built-in kullanıcı silinemez veya güncellenemez
              </Alert>
            </div>
          )}
          {justManager && (
            <div className="alert">
              <Alert variant="warning" className="mt-3">
                Yönetici hesapları bu bölümde silinemez veya güncellenemez
              </Alert>
            </div>
          )}
          {statusAnonymous && (
            <div className="alert">
              <Alert variant="warning" className="mt-3">
                Hesabı kaldırılan kullanıcı
              </Alert>
            </div>
          )}
        </fieldset>
      </Form>
    </Container>
  );
};

export default AdminUserEdit1;
