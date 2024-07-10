import React, { Fragment, useEffect, useRef, useState } from "react";
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
  Pagination,
  Alert,
} from "react-bootstrap";
import {
  AiFillPlusCircle,
  AiFillMinusCircle,
  AiFillCamera,
  AiOutlineCamera,
} from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { question, toast } from "../../../helpers/functions/swal";
import "./admin-product-edit.scss";
import { settings } from "../../../helpers/setting";
import {
  deleteProductById,
  deleteProductImageById,
  getProductById,
  showCaseImage,
  updateProductById,
} from "../../../api/product-service";
import Loading from "../../common/loading/loading";
import { uploadImage } from "../../../api/image-service";
import { getCategoriesOption } from "../../../api/category-service";
import ProductsReviews from "./products-reviews";
import { getReviewsProductById } from "../../../api/review-services";
import { getDate } from "../../../helpers/functions/date-time";
import AdminPageTitle from "../common/admin-page-title";

const AdminProductEdit = () => {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [
    //imageDeleting,
    setImageDeleting,
  ] = useState(false);
  const [categoryIdData, setCategoryIdData] = useState([]);
  const [reviewsProductData, setReviewsProductData] = useState([]);
  const [paging, setPaging] = useState({});
  const navigate = useNavigate();

  const [oneNewImage, setOneNewImage] = useState([]);

  const { productId } = useParams();
  const fileImageRef = useRef();

  const [initialValues, setInitialValues] = useState({
    title: "",
    longDesc: "",
    price: "",
    tax: "",
    discount: "",
    stockAmount: "",
    categoryId: "",
    imageId: [],
    featured: false,
    newProduct: false,
    status: "NOT_PUBLISHED",
    builtIn: false,
    image: [],
    createAt: "",
    updateAt: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Please enter the title")
      .min(3, "Please enter at least 5 characters")
      .max(150, "Please enter the most 150 characters"),
    longDesc: Yup.string().max(3500, "Please enter the most 3500 characters"),
    price: Yup.number().required("Please enter the price"),
    tax: Yup.number().required("Please enter the tax"),
    discount: Yup.number()
      .required("Please enter the discount")
      .min(0, "no less than %0")
      .max(100, "no more than %100"),
    stockAmount: Yup.number().required("Please enter stock amount"),
    categoryId: Yup.number().required("Please select category"),
    featured: Yup.boolean().required(),
    newProduct: Yup.boolean(),
    image: Yup.array()
      .min(1, "Please select at least one image")
      .required("Please select an image"),
  });

  const loadData = async (page) => {
    try {
      const resp = await getProductById(productId);
      const categoryResp = await getCategoriesOption();
      const reviewsResp = await getReviewsProductById(productId, page);
      setInitialValues({
        ...resp.data,
        imageId: [],
        categoryId: resp.data.category.id,
      });
      setImageSrc(resp.data.image);
      setCategoryIdData(categoryResp.data);
      const { content, totalPages, pageable } = reviewsResp.data;
      setReviewsProductData(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    setUpdating(true);
    try {
      //console.log("neden calismadi");
      values.imageId = oneNewImage;
      await updateProductById(productId, values);
      toast("Ürün Güncellendi", "success");
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

  const removeProduct = async () => {
    setDeleting(true);
    try {
      await deleteProductById(productId);
      toast("Ürün Silindi", "success");
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
          removeProduct();
        }
      }
    );
  };

  const handleChangeImage = async (e) => {
    const files = fileImageRef.current.files;
    if (files.length <= 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i]);
    }
    try {
      const resp = await uploadImage(formData);
      const imageIds = resp.data.imageId;
      setOneNewImage(imageIds);
      formik.setFieldValue("image", [...formik.values.image, ...imageIds]);
      setImageSrc((prev) => [...prev, ...imageIds]);
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  const deleteImageData = async (values) => {
    setImageDeleting(true);
    try {
      await deleteProductImageById(values);
      toast("Resim Silindi", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setImageDeleting(false);
    }
  };

  const deleteProductImage = (src, i) => {
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
          deleteImageData(src);
        }
      }
    );
  };

  const selectedShowCaseImage = async (imageId, i) => {
    try {
      const updatedImages = [...imageSrc];
      updatedImages.forEach((img) => (img.showcase = false));
      updatedImages[i].showcase = true;
      setImageSrc(updatedImages);
      await showCaseImage(productId, imageId);
      toast("Seçilen görselin vitrin görseli oluşturuldu.", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  useEffect(() => {
    loadData(0);
    // eslint-disable-next-line
  }, []);

  const updateAt = formik.values.updateAt
    ? getDate(formik.values.updateAt)
    : "";

  return (
    <Container fluid className="admin-product-edit">
      <AdminPageTitle titleEdit={`${formik.values.title}`} />
      {loading ? (
        <Loading />
      ) : (
        <Form noValidate onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.values.builtIn}>
            <Row className="mt-5">
              <Col xl={3} lg={3} md={4} sm={4} className="like-active mb-3">
                <ul
                  style={{
                    marginBottom: formik.values.builtIn ? "1rem" : "2rem",
                  }}
                >
                  <li>
                    Oluşturulma Tarihi:{" "}
                    <span>{getDate(formik.values.createAt)}</span>
                  </li>
                  <li>
                    Güncellenme Tarihi: <span>{updateAt}</span>
                  </li>
                  <li>
                    Built-in:{" "}
                    <span>
                      {formik.values.builtIn.toString().toUpperCase()}
                    </span>
                  </li>
                </ul>
                {formik.values.builtIn && (
                  <div className="alert">
                    <Alert variant="danger">
                      Built-in ürün silinemez veya güncellenemez.
                    </Alert>
                  </div>
                )}
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="Aktif"
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

                  <Form.Group as={Col} className="mb-3">
                    <Form.Label>Açıklama</Form.Label>
                    <Form.Control
                      type="text"
                      as="textarea"
                      rows="5"
                      {...formik.getFieldProps("longDesc")}
                    />
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
                            formik.touched.categoryId &&
                            !formik.errors.categoryId
                          }
                          isInvalid={
                            formik.touched.categoryId &&
                            !!formik.errors.categoryId
                          }
                        >
                          <option value="">Kategori Seçiniz</option>

                          {categoryIdData.map((option, i) => {
                            return (
                              <option
                                className="py-2"
                                value={option.id}
                                key={i}
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
                  ref={fileImageRef}
                  multiple
                />
                <Form.Label
                  style={{ opacity: formik.values.builtIn ? "0.65" : "1" }}
                >
                  <span>
                    <AiFillPlusCircle
                      className="plus"
                      style={{
                        cursor: formik.values.builtIn ? "default" : "pointer",
                      }}
                    />
                  </span>
                </Form.Label>
              </Form.Group>
              <Badge bg="secondary" className="image-error">
                {formik.errors.image}
              </Badge>
              <Col>
                <Row className="g-3">
                  {imageSrc.map((src, i) => (
                    <Col xs={12} sm={4} md={2} key={i}>
                      <Card className="deleteCard">
                        <span
                          onClick={() => {
                            if (!formik.values.builtIn) {
                              deleteProductImage(src.imageId, i);
                            }
                          }}
                        >
                          <AiFillMinusCircle
                            className="minus"
                            style={{
                              opacity: formik.values.builtIn ? "0.65" : "1",
                              cursor: formik.values.builtIn
                                ? "default"
                                : "pointer",
                            }}
                          />
                        </span>
                        <img
                          src={`${settings.apiURL}/image/display/${
                            src.imageId || src
                          }`}
                          alt=""
                          className="img-fluid"
                          width="100px"
                        />
                        <span
                          onClick={() => {
                            if (!formik.values.builtIn) {
                              selectedShowCaseImage(src.imageId, i);
                            }
                          }}
                          disabled={formik.values.builtIn}
                        >
                          {src.showcase === true ? (
                            <>
                              <AiFillCamera
                                className="showcase"
                                style={{
                                  opacity: formik.values.builtIn ? "0.65" : "1",
                                  cursor: formik.values.builtIn
                                    ? "default"
                                    : "pointer",
                                }}
                              />
                              <span className="text">Showcase</span>
                            </>
                          ) : src.showcase === false ? (
                            <>
                              <AiOutlineCamera
                                className="showcase"
                                style={{
                                  opacity: formik.values.builtIn ? "0.65" : "1",
                                  cursor: formik.values.builtIn
                                    ? "default"
                                    : "pointer",
                                }}
                              />
                              <span className="text">Showcase</span>
                            </>
                          ) : (
                            <button
                              className="showcaseNone"
                              disabled={formik.values.builtIn}
                            />
                          )}
                        </span>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
            <div className="alert">
              <Alert variant="warning" className="mt-3">
                Yüklemek istediğiniz görsellerin yükseklik ve genişliğinin eşit
                olduğundan emin olunuz.
              </Alert>
            </div>
            <div className="text-end">
              <ButtonGroup className="my-5">
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && <Spinner animation="border" size="sm" />} Sil
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!(formik.dirty && formik.isValid) || updating}
                >
                  {updating && <Spinner animation="border" size="sm" />}{" "}
                  Güncelle
                </Button>
              </ButtonGroup>
            </div>
          </fieldset>
        </Form>
      )}

      <ProductsReviews
        reviewsProductData={reviewsProductData}
        setReviewsProductData={setReviewsProductData}
      />

      {paging.totalPages > 1 && (
        <Row className="mt-5 justify-content-center">
          <Pagination className="pagination">
            {paging.pageNumber > 0 && (
              <>
                <Pagination.First onClick={() => loadData(0)} />
                <Pagination.Prev
                  onClick={() => loadData(paging.pageNumber - 1)}
                />
              </>
            )}
            {paging.pageNumber > 2 && (
              <Pagination.Ellipsis
                onClick={() => loadData(paging.pageNumber - 2)}
              />
            )}
            {[...Array(paging.totalPages)].map((item, index) => (
              <Fragment key={index}>
                {index === paging.pageNumber && (
                  <Pagination.Item active>{index + 1}</Pagination.Item>
                )}
                {index !== paging.pageNumber &&
                  index >= Math.max(0, paging.pageNumber - 1) &&
                  index <=
                    Math.min(paging.totalPages - 1, paging.pageNumber + 1) && (
                    <Pagination.Item
                      key={index}
                      onClick={() => loadData(index)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  )}
              </Fragment>
            ))}
            {paging.pageNumber < paging.totalPages - 3 && (
              <Pagination.Ellipsis
                onClick={() => loadData(paging.pageNumber + 2)}
              />
            )}
            {paging.pageNumber < paging.totalPages - 1 && (
              <>
                <Pagination.Next
                  onClick={() => loadData(paging.pageNumber + 1)}
                />
                <Pagination.Last
                  onClick={() => loadData(paging.totalPages - 1)}
                />
              </>
            )}
          </Pagination>
        </Row>
      )}
    </Container>
  );
};

export default AdminProductEdit;
