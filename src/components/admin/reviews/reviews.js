import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  InputGroup,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import "./reviews.scss";
import { question, toast } from "../../../helpers/functions/swal";
import {
  deleteReviews,
  getAllCommentsByPage,
  updateReviewById,
} from "../../../api/review-services";
import { FaSearch } from "react-icons/fa";
import AdminPageTitle from "../common/admin-page-title";
import { Stars } from "../../../helpers/functions/star";
import { Fragment } from "react";
const AdminReviews = () => {
  const [comments, setComments] = useState([]);
  const [paging, setPaging] = useState({});
  // eslint-disable-next-line
  const [updating, setUpdating] = useState(false);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line
  const [deleting, setDeleting] = useState(false);
  const [filters, setFilters] = useState({ q: "", rate: "", status: "" });
  const loadData = async (page) => {
    try {
      const resp = await getAllCommentsByPage(
        filters.q,
        filters.rate,
        filters.status,
        page
      );
      const { content, totalPages, pageable } = resp.data;
      setComments(content);
      // setFilteredComments(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
      // setFilters(content);
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    try {
      await updateReviewById(id, { status });
      toast("Yorum Başarıyla Güncellendi", "success");
      setComments((prevComments) => {
        return prevComments.map((review) => {
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
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(0);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [filters]);
  const removeContent = async (id) => {
    setDeleting(true);
    try {
      await deleteReviews(id);
      toast("Yorum Silindi", "success");
      setComments(comments.filter((c) => c.id !== id));
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };
  const handleDelete = (id) => {
    question("Silmek istediğinize emin misiniz?", "Geri dönüş yok!").then(
      (result) => {
        if (result.isConfirmed) {
          removeContent(id);
        }
      }
    );
  };

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  return (
    <Container className="admin-reviews">
      <AdminPageTitle />
      <Row className="mt-5 mb-5 input-groups">
        <Col md={6} className="mb-1">
          <InputGroup className="searchbox">
            <Form.Control
              type="search"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Bir seyler yaziniz"
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={3} className="mb-1">
          <InputGroup className="selectbox">
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Durum Seçiniz</option>
              <option value="PUBLISHED">Onaylanmış</option>
              <option value="NOT_PUBLISHED">Onaylanmamış</option>
            </Form.Select>
          </InputGroup>
        </Col>
        <Col md={3} className="mb-1">
          <InputGroup className="selectbox option-star">
            <Form.Select
              name="rate"
              value={filters.rate}
              onChange={handleFilterChange}
              className="rating"
              style={{
                color: filters.rate === "" ? "black" : "rgb(230, 57, 70)",
              }}
            >
              <option value="" style={{ color: "black", fontSize: "0.9rem" }}>
                Değerlendirme Seçiniz
              </option>
              {Stars()}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
      <Row className="reviews-layout">
        <Col>
          {comments.map((review) => (
            <Row className="comments-stars-name" key={review.id}>
              <Col md={1} className="name">
                <div className="content">
                  {review.userFullName
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")}
                </div>
              </Col>
              <Col md={9} className="stars-comments">
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

export default AdminReviews;
