import React, { Fragment } from "react";
import { useState } from "react";
import { Col, Container, Form, Pagination, Row, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentDate, getDate } from "../../../helpers/functions/date-time";
import { getUserOrdersAdmin } from "../../../api/order-service";
import { useEffect } from "react";
import { toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";

const AdminUserEditOrders = () => {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [paging, setPaging] = useState({});
  const [filters, setFilters] = useState({ date1: "", date2: "", status: [] });

  const navigate = useNavigate();

  function handleClick(id) {
    navigate(`/admin/orders/${id}`);
  }

  const loadData = async (page) => {
    setLoading(true);
    try {
      const resp = await getUserOrdersAdmin(
        userId,
        filters.status[0],
        filters.date1,
        filters.date2,
        page,
        5,
        "createAt",
        "DESC"
      );
      const { content, totalPages, pageable } = resp.data;
      setOrdersData(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(0);
    // eslint-disable-next-line
  }, [filters]);

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = name === "status" ? [e.target.value] : e.target.value;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <Row>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Başlangıç Tarihi</Form.Label>
          <Form.Control
            type="date"
            name="date1"
            max={
              filters.date2 && getCurrentDate() > filters.date2
                ? filters.date2
                : getCurrentDate()
            }
            value={filters.date1}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Bitiş Tarihi</Form.Label>
          <Form.Control
            type="date"
            min={filters.date1}
            name="date2"
            value={filters.date2}
            onChange={handleFilterChange}
            max={getCurrentDate()}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3">
          <Form.Label>Durum</Form.Label>
          <Form.Select
            name="status"
            value={filters.status[0]}
            onChange={handleFilterChange}
          >
            <option value="">Durum Seçiniz</option>
            <option value="PENDING">Askıda</option>
            <option value="BEING_SUPPLIED">Tedarik Ediliyor</option>
            <option value="READY_TO_SHIP">Gönderime Hazır</option>
            <option value="DELIVERY_DONE">Teslimat Tamamlandı</option>
            <option value="RETURNED">İade</option>
            <option value="CANCELED">İptal edildi</option>
          </Form.Select>
        </Form.Group>
      </Row>
      <Table responsive>
        <thead className="tableTitles">
          <tr>
            <th>Sipariş Tarihi</th>
            <th>Kod</th>
            <th className="text-center">Öğeler</th>
            <th className="text-center">Durum</th>
            <th className="text-end">Toplam</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {ordersData?.map((details, i) => (
            <tr key={i} onClick={() => handleClick(details.id)}>
              <td>{getDate(details.createAt)}</td>
              <td>{details.code}</td>
              <td className="text-center">{details.orderItemsDTO.length}</td>
              <td className="text-center">{details.status}</td>
              <td className="text-end">{details.grandTotal.toFixed(2)} TL</td>
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

export default AdminUserEditOrders;
