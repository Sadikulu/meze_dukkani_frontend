import React, { Fragment } from "react";
import { Container, Pagination, Row, Table } from "react-bootstrap";
import Loading from "../../common/loading/loading";
import { useEffect } from "react";
import { useState } from "react";
import { getUserReviewsAdmin } from "../../../api/review-services";
import { toast } from "../../../helpers/functions/swal";
import { useParams } from "react-router-dom";

const AdminUserEditReviews = () => {
  const { userId } = useParams();
  const [reviewsData, setReviewsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paging, setPaging] = useState({});

  const loadData = async (page) => {
    setLoading(true);
    try {
      const resp = await getUserReviewsAdmin(userId, page);
      const { content, totalPages, pageable } = resp.data;
      setReviewsData(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0);
    // eslint-disable-next-line
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <Table responsive="md">
        <thead className="tableTitles">
          <tr>
            <th>Yorum</th>
            <th>Değerlendirme</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {reviewsData.map((details) => (
            <tr key={details.id}>
              <td>{details.content}</td>
              <td>{details.rating}</td>
              <td>{details.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
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

export default AdminUserEditReviews;
