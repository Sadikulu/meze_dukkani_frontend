import React from "react";
import { Col, Form, Row } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useState } from "react";
import { question, toast } from "../../../helpers/functions/swal";
import { deleteReviews, updateReviewById } from "../../../api/review-services";

const ProductsReviews = ({ reviewsProductData, setReviewsProductData }) => {
  // eslint-disable-next-line
  const [deleting, setDeleting] = useState(false);
  //eslint-disable-next-line
  const [updating, setUpdating] = useState(false);
  // const [statuses, setStatuses] = useState(
  //   Array.from({ length: reviewsProductData.length }, () => "NOT_PUBLISHED")
  // );

  // const handleStatusChange = (index) => (e) => {
  //   const newStatuses = [...statuses];
  //   newStatuses[index] = e.target.checked ? "PUBLISHED" : "NOT_PUBLISHED";
  //   setStatuses(newStatuses);
  // };
  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await updateReviewById(id, { status });
      toast("Yorum Başarıyla Güncellendi", "success");
      setReviewsProductData((prevComment) => {
        return prevComment.map((review) => {
          if (review.id === id) {
            return { ...review, status };
          }
          return review;
        });
      });
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setUpdating(false);
    }
  };
  const removeReview = async (id) => {
    setDeleting(true);
    try {
      await deleteReviews(id);
      toast("Yorum Silindi", "success");
      setReviewsProductData(
        reviewsProductData.filter((review) => review.id !== id)
      );
    } catch (err) {
      console.log(err);
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = (id) => {
    question("Silmek istediğinize emin misiniz?", "Geri dönüş yok!").then(
      (result) => {
        if (result.isConfirmed) {
          removeReview(id);
        }
      }
    );
  };

  return (
    <section className="product-reviews-layout">
      <h5>Yorumlar</h5>
      <Row>
        <Col>
          {reviewsProductData.map((review) => (
            <Row className="comments-stars-name" key={review.id}>
              <Col md={1} className="name">
                <div className="content">
                  {review.userFullName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
                </div>
              </Col>
              <Col md={8} className="stars-comments">
                <div className="stars">
                  {[...new Array(5)].map((item, i) =>
                    i < review.rating ? (
                      <AiFillStar key={i} />
                    ) : (
                      <AiOutlineStar key={i} />
                    )
                  )}
                </div>
                <div>{review.content}</div>
              </Col>
              <Col md={2} className="switch-delete">
                <Form>
                  <Form.Check
                    type="switch"
                    label="Aktif"
                    onChange={(e) =>
                      handleStatusChange(
                        review.id,
                        e.target.checked ? "PUBLISHED" : "NOT_PUBLISHED"
                      )
                    }
                    checked={review.status === "PUBLISHED"}
                  />
                  <span onClick={() => handleDelete(review.id)}>
                    <BiTrash />
                  </span>
                </Form>
              </Col>
            </Row>
          ))}
        </Col>
      </Row>
    </section>
  );
};

export default ProductsReviews;
