import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router";
import "./orders.scss";
import Sidebar from "./sidebar";
import { getOrdersByPage } from "../../../api/order-service";
import { getDate } from "../../../helpers/functions/date-time";

const handleQuantity = (row) => {
  let totalQuantity = 0;
  row.orderItemsDTO.map((order) => (totalQuantity += order.quantity));
  return totalQuantity;
};

const columns = [
  {
    name: "Order Date",
    selector: (row) => getDate(row.createAt),
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

  const loadData = async (page) => {
    try {
      const resp = await getOrdersByPage(page, perPage);
      const { content, totalElements } = resp.data;
      setOrders(content);
      setTotalRows(totalElements);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRowsPerPage = async (newPerPage, page) => {
    try {
      const resp = await getOrdersByPage(page - 1, newPerPage);
      const { content } = resp.data;
      setOrders(content);
      setPerPage(newPerPage);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (page) => {
    loadData(page - 1);
  };

  const handleRowClicked = (row) => {
    navigate(`/user/orders/${row.id}`);
  };

  useEffect(() => {
    loadData(0);
    //  eslint-disable-next-line
  }, []);

  return (
    <Container className="orders-data-table">
      <Row className="orders-data-table-row">
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8}>
          <DataTable
            title="Orders"
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
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;
