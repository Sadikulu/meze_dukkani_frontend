import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Button, Pagination, Spinner } from "react-bootstrap";
import { Col, Form, Nav, Row, Tab } from "react-bootstrap";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { toast } from "../../../helpers/functions/swal";
import "./comments.scss";
import { useAppSelector } from "../../../store/hooks";
import { sendMessage } from "../../../api/review-services";
import { Stars } from "../../../helpers/functions/star";

const Comments = ({ products, reviewsData, paging, loadData }) => {
  const { isUserLogin } = useAppSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const [key, setKey] = useState("description");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    setKey(searchParams.get("key") || "description");
  }, [searchParams]);
  const navigate = useNavigate();
  const { shopId } = useParams();

  const initialValues = {
    rating: "",
    content: "",
    productId: shopId,
  };

  const validationSchema = Yup.object({
    rating: Yup.number().required("Enter a score!"),
    content: Yup.string()
      .max(200, "The comment should the most 200 chars")
      .min(10, "The comment should be at least 10 chars")
      .required("Yorumunuzu Giriniz"),
  });
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await sendMessage(values);
      formik.resetForm();
      toast("Mesajınız başarıyla gönderildi", "success");
    } catch (err) {
      alert(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  //show form
  const shwForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="comments-tab">
      <Tab.Container
        id="left-tabs-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Row>
          <Col lg={12}>
            <Nav variant="pills" className="flex-row ">
              <Nav.Item>
                <Nav.Link
                  eventKey="description"
                  onClick={() =>
                    navigate(`/shop/${products.id}?key=description`)
                  }
                >
                  <h6>Açıklama</h6>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comments" id="co">
                  <h6> Yorumlar </h6>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col className="contects">
            <Tab.Content className="desc-comm">
              <Tab.Pane eventKey="description" className="description">
                <p>{products.longDesc} </p>
              </Tab.Pane>
              <Tab.Pane className="comments" eventKey="comments">
                {isUserLogin ? (
                  <div className="write">
                    <button onClick={shwForm}>Yorumunuzu Yazınız</button>
                    {showForm && (
                      <div className="score">
                        <Form noValidate onSubmit={formik.handleSubmit}>
                          <Form.Group className="mb-3 option-star">
                            <Form.Label>Puan</Form.Label>

                            <Form.Select
                              {...formik.getFieldProps("rating")}
                              isValid={
                                formik.touched.rating && !formik.errors.rating
                              }
                              isInvalid={
                                formik.touched.rating && !!formik.errors.rating
                              }
                              style={{
                                color:
                                  formik.values.rating === ""
                                    ? "black"
                                    : "rgb(230, 57, 70)",
                              }}
                            >
                              <option value="" style={{ color: "black" }}>
                                Puanınızı Giriniz
                              </option>
                              {Stars()}
                            </Form.Select>

                            <Form.Control.Feedback type="invalid">
                              {formik.errors.rating}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Yorumlar</Form.Label>
                            <Form.Control
                              className="textarea"
                              type="text"
                              as="textarea"
                              rows="5"
                              {...formik.getFieldProps("content")}
                              isInvalid={
                                formik.touched.content &&
                                !!formik.errors.content
                              }
                              isValid={
                                formik.touched.content && !formik.errors.content
                              }
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.content}
                            </Form.Control.Feedback>
                          </Form.Group>
                          <Button
                            className="send"
                            type="submit"
                            disabled={
                              !(formik.dirty && formik.isValid) || loading
                            }
                          >
                            {loading && (
                              <Spinner animation="border" size="sm" />
                            )}{" "}
                            Gönder
                          </Button>
                        </Form>
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}

                {reviewsData.length > 0 ? (
                  reviewsData
                    .filter((item) => item.status === "PUBLISHED")
                    .map((review) => (
                      <div className="comments-stars-name" key={review.id}>
                        <span className="name">
                          {review.userFullName
                            .split(" ")
                            .map((word) => word.charAt(0).toUpperCase())
                            .join("")}
                        </span>
                        <div className="stars-comments">
                          <span className="stars">
                            {[...new Array(5)].map((item, index) =>
                              index < review.rating ? (
                                <AiFillStar key={index} />
                              ) : (
                                <AiOutlineStar key={index} />
                              )
                            )}
                          </span>

                          <div className="comments">
                            <p>{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="no-comment">
                    Bu ürün için henüz yorum yapılmadı. İlk yorumu siz yapınız..
                  </p>
                )}

                {paging.totalPages > 1 && (
                  <Pagination className="">
                    <Pagination.First
                      onClick={() => loadData(0)}
                      disabled={paging.pageNumber <= 0}
                    />
                    <Pagination.Prev
                      onClick={() => loadData(paging.pageNumber - 1)}
                      disabled={paging.pageNumber <= 0}
                    />
                    {[...Array(paging.totalPages)].map((item, index) => (
                      <Pagination.Item
                        active={index === paging.pageNumber}
                        key={index}
                        onClick={() =>
                          index !== paging.pageNumber && loadData(index)
                        }
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => loadData(paging.pageNumber + 1)}
                      disabled={paging.pageNumber >= paging.totalPages - 1}
                    />
                    <Pagination.Last
                      onClick={() => loadData(paging.totalPages - 1)}
                      disabled={paging.pageNumber >= paging.totalPages - 1}
                    />
                  </Pagination>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};
export default Comments;
