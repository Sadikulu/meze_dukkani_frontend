import React, { useEffect } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import "./orders.scss";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { getOrdersAdmin } from "../../../api/order-service";
import {
  getCurrentDate,
  getDate,
  validateEndDate,
} from "../../../helpers/functions/date-time";
import { toast } from "../../../helpers/functions/swal";
import AdminPageTitle from "../common/admin-page-title";

const handleQuantity = (row) => {
  let totalQuantity = 0;
  row.orderItemsDTO.map((order) => (totalQuantity += order.quantity));
  return totalQuantity;
};

const columns = [
  {
    name: "Contact Name",
    selector: (row) => row.contactName,
  },
  {
    name: "Date",
    selector: (row) => getDate(row.createAt),
  },
  {
    name: "Code",
    selector: (row) => row.code,
  },
  {
    name: "Items",
    selector: (row) => handleQuantity(row),
    center: true,
  },
  {
    name: "Status",
    selector: (row) => row.status,
    center: true,
  },
  {
    name: "Total",
    selector: (row) => row.grandTotal.toFixed(2),
    right: true,
  },
];

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    q: "",
    status: [],
    startDate: "",
    endDate: "",
  });

  const loadData = async (page) => {
    setLoading(true);
    try {
      const resp = await getOrdersAdmin(
        filters.q,
        filters.status[0],
        filters.startDate,
        filters.endDate,
        page,
        perPage,
        "id",
        "DESC"
      );
      const { content, totalElements } = resp.data;
      setOrders(content);
      setTotalRows(totalElements);
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (newPerPage, page) => {
    setLoading(true);
    try {
      const resp = await getOrdersAdmin(
        filters.q,
        filters.status[0],
        filters.startDate,
        filters.endDate,
        page - 1,
        newPerPage,
        "id",
        "DESC"
      );
      const { content } = resp.data;
      setOrders(content);
      setPerPage(newPerPage);
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (page) => {
    loadData(page - 1);
  };

  const handleRowClicked = (row) => {
    navigate(`/admin/orders/${row.id}`);
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

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = name === "status" ? [e.target.value] : e.target.value;
    if (name === "endDate") {
      const endDate = validateEndDate(filters.startDate, value);
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: endDate,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  return (
    <Container className="orders-page">
      <AdminPageTitle />
      <Row className="mt-5 searchbox ">
        <Col md={12} className="mb-1">
          <InputGroup className="mb-3">
            <Form.Control
              type="search"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Bir şeyler yazınız"
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-5 date-and-status">
        <Col sm={6} md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Başlangıç Tarihi</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              max={
                filters.endDate && getCurrentDate() > filters.endDate
                  ? filters.endDate
                  : getCurrentDate()
              }
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>
        <Col sm={6} md={4}>
          <Form.Group className="mb-3">
            <Form.Label>Bitiş Tarihi</Form.Label>
            <Form.Control
              type="date"
              min={filters.startDate}
              name="endDate"
              max={getCurrentDate()}
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>
        <Col sm={12} md={4}>
          <Form.Group className="mb-3">
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
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={orders}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onChangePage={handleChangePage}
        onRowClicked={handleRowClicked}
      />
    </Container>
  );
};

export default Orders;
