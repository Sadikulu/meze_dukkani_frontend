import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  Button,
  Row,
  Col,
  ButtonGroup,
  Spinner,
  Badge,
  Container,
  Card,
  Alert,
} from "react-bootstrap";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { question, toast } from "../../../helpers/functions/swal";
import "./admin-product-new.scss";
import { getCategoriesOption } from "../../../api/category-service";
import { createProduct } from "../../../api/product-service";
import { uploadImage } from "../../../api/image-service";
import Loading from "../../common/loading/loading";
import AdminPageTitle from "../common/admin-page-title";

const AdminProductNew = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [categoryIdData, setCategoryIdData] = useState([]);
  const [imageSrc, setImageSrc] = useState([]);
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    // shortDesc: "",
    longDesc: "",
    price: "",
    tax: "",
    discount: "",
    stockAmount: "",
    stockAlarmLimit: "",
    categoryId: "",
    imageId: [],
    image: [],
    featured: false,
    newProduct: false,
    status: "NOT_PUBLISHED",
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Please enter the title")
      .min(3, "Please enter at least 3 characters")
      .max(150, "Please enter the most 150 characters"),
    // shortDesc: Yup.string().max(500, "Please enter the most 500 characters"),
    longDesc: Yup.string().max(3500, "Please enter the most 3500 characters"),
    price: Yup.number().required("Please enter the price"),
    tax: Yup.number().required("Please enter the tax"),
    discount: Yup.number()
      .required("Please enter the discount")
      .min(0, " min sale 0")
      .max(100, " max sale 100%"),
    stockAmount: Yup.number().required("Please enter stock amount"),
    categoryId: Yup.number().required("Please enter category"),
    featured: Yup.boolean(),
    newProduct: Yup.boolean(),
    image: Yup.array()
      .min(1, "Please select at least one image")
      .required("Please select an image"),
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const categoryResp = await getCategoriesOption();
      setCategoryIdData(categoryResp.data);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const localUploadImages = async (image) => {
    const formData = new FormData();
    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i]);
    }
    const resp = await uploadImage(formData);
    return resp.data.imageId;
  };

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      const imageIds = await localUploadImages(values.image);
      values.imageId = imageIds;
      delete values.image;
      await createProduct(values);
      toast("Ürün Oluşturuldu", "success");
      navigate(-1);
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleChangeImage = (e) => {
    const files = e.target.files;
    if (files.length <= 0) return;
    const image = [];
    for (let i = 0; i < files.length; i++) {
      image.push(URL.createObjectURL(files[i]));
    }
    formik.setFieldValue("image", [...formik.values.image, ...files]);
    setImageSrc((prev) => [...prev, ...image]);
  };

  const deleteProductImage = (i) => {
    question("Silmek istediğinize emin misiniz?", "Geri dönüş yok!").then(
      (result) => {
        if (result.isConfirmed) {
          formik.setFieldValue(
            "image",
            formik.values.image.filter((item, index) => index !== i)
          );
          setImageSrc((prevImages) =>
            prevImages.filter((item, index) => index !== i)
          );
        }
      }
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Container fluid className="product-new">
      <AdminPageTitle />
      {loading ? (
        <Loading />
      ) : (
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Row className="mt-5">
            <Col xl={3} lg={3} md={4} sm={4} className="like-active mb-3">
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Aktif"
                value={formik.values.status}
                checked={formik.values.status === "PUBLISHED"}
                onChange={(e) =>
                  formik.setFieldValue(
                    "status",
                    e.target.checked ? "PUBLISHED" : "NOT_PUBLISHED"
                  )
                }
              />

              <Form.Check
                type="switch"
                label="Yeni Ürün"
                checked={formik.values.newProduct === true}
                onChange={(e) =>
                  formik.setFieldValue(
                    "newProduct",
                    e.target.checked ? true : false
                  )
                }
              />
              <Form.Check
                type="switch"
                label="Öne Çıkan"
                checked={formik.values.featured === true}
                onChange={(e) =>
                  formik.setFieldValue(
                    "featured",
                    e.target.checked ? true : false
                  )
                }
              />
            </Col>
            <Col xl={9} lg={9} md={8} sm={8}>
              <Row className="row-cols-1 row-cols-md-1">
                <Form.Group as={Col} className="mb-3">
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

                {/* <Form.Group as={Col} className="mb-3">
                  <Form.Label>Kısa Açıklama</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows="2"
                    {...formik.getFieldProps("shortDesc")}
                    isValid={
                      formik.touched.shortDesc && !formik.errors.shortDesc
                    }
                    isInvalid={
                      formik.touched.shortDesc && !!formik.errors.shortDesc
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.shortDesc}
                  </Form.Control.Feedback>
                </Form.Group> */}

                <Form.Group as={Col} className="mb-3">
                  <Form.Label>Uzun Açıklama</Form.Label>
                  <Form.Control
                    type="text"
                    as="textarea"
                    rows="5"
                    {...formik.getFieldProps("longDesc")}
                    isValid={formik.touched.longDesc && !formik.errors.longDesc}
                    isInvalid={
                      formik.touched.longDesc && !!formik.errors.longDesc
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.longDescription}
                  </Form.Control.Feedback>
                </Form.Group>

                <Col>
                  <Row className="row-cols-1 row-cols-md-2 row-cols-xl-3">
                    <Form.Group as={Col} className="mb-3">
                      <Form.Label>Fiyat</Form.Label>
                      <Form.Control
                        type="number"
                        {...formik.getFieldProps("price")}
                        isValid={formik.touched.price && !formik.errors.price}
                        isInvalid={
                          formik.touched.price && !!formik.errors.price
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.price}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                      <Form.Label>KDV</Form.Label>
                      <Form.Control
                        type="number"
                        {...formik.getFieldProps("tax")}
                        isValid={formik.touched.tax && !formik.errors.tax}
                        isInvalid={formik.touched.tax && !!formik.errors.tax}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.tax}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                      <Form.Label>İndirim</Form.Label>
                      <Form.Control
                        type="number"
                        {...formik.getFieldProps("discount")}
                        isValid={
                          formik.touched.discount && !formik.errors.discount
                        }
                        isInvalid={
                          formik.touched.discount && !!formik.errors.discount
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.discount}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                      <Form.Label>Stok Miktarı</Form.Label>
                      <Form.Control
                        type="number"
                        {...formik.getFieldProps("stockAmount")}
                        isValid={
                          formik.touched.stockAmount &&
                          !formik.errors.stockAmount
                        }
                        isInvalid={
                          formik.touched.stockAmount &&
                          !!formik.errors.stockAmount
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.stockAmount}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                      <Form.Label>Kategori</Form.Label>
                      <Form.Select
                        type="number"
                        {...formik.getFieldProps("categoryId")}
                        isValid={
                          formik.touched.categoryId && !formik.errors.categoryId
                        }
                        isInvalid={
                          formik.touched.categoryId &&
                          !!formik.errors.categoryId
                        }
                      >
                        <option value="">Kategori Seçiniz</option>

                        {categoryIdData.map((option) => {
                          return (
                            <option
                              className="py-2"
                              value={option.id}
                              key={option.id}
                            >
                              {option.title}
                            </option>
                          );
                        })}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.categoryId}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className="my-5 mx-1 card-add-delete">
            <Form.Group controlId="fileSelect">
              <Form.Control
                type="file"
                name="image"
                accept=".jpg, .jpeg, .png, .webp"
                onChange={handleChangeImage}
                className="d-none"
                multiple
              />
              <Form.Label>
                <span>
                  <AiFillPlusCircle className="plus" />
                </span>
              </Form.Label>
            </Form.Group>
            <Badge
              bg="secondary"
              className="image-error"
              style={{ whiteSpace: "normal" }}
            >
              {formik.errors.image}
            </Badge>
            <Col>
              <Row className="g-3">
                {imageSrc.map((src, i) => (
                  <Col xs={12} sm={4} md={2} key={i}>
                    <Card className="deleteCard">
                      <span onClick={() => deleteProductImage(i)}>
                        <AiFillMinusCircle className="minus" />
                      </span>
                      <img
                        src={src}
                        alt=""
                        className="img-fluid"
                        width="100px"
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <div className="alert">
            <Alert variant="warning" className="mt-3">
              Yüklemek istediğiniz resimlerin boyutlarının eşit olduğundan emin
              olunuz.
            </Alert>
          </div>
          <div className="text-end">
            <ButtonGroup className="mt-5">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                İptal
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={!(formik.dirty && formik.isValid) || updating}
              >
                {updating && <Spinner animation="border" size="sm" />} Oluştur
              </Button>
            </ButtonGroup>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default AdminProductNew;
