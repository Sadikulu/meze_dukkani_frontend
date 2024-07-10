import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getCategoriesByPage } from "../../../api/category-service";
import "./admin-categories.scss";
import AdminPageTitle from "../common/admin-page-title";
const columns = [
  {
    selector: (row) => row.title,
  },
  {
    selector: (row) => row.status,
  },
];
const AdminCategories = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    q: "",
    status: "",
  });
  const loadData = async (page) => {
    try {
      const resp = await getCategoriesByPage(
        filters.q,
        filters.status[0],
        page,
        perPage
      );
      const { content, totalElements } = resp.data;
      setCategories(content);
      setTotalRows(totalElements);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeRowsPerPage = async (newPerPage, page) => {
    try {
      const resp = await getCategoriesByPage(
        filters.q,
        filters.status[0],
        page - 1,
        newPerPage
      );
      const { content } = resp.data;
      setCategories(content);
      setPerPage(newPerPage);
    } catch (err) {
      console.log(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleChangePage = (page) => {
    loadData(page - 1);
  };
  const handleRowClicked = (row) => {
    navigate(`/admin/categories/${row.id}`);
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
  // const handleFilterChange = (e) => {
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [e.target.name]: e.target.value,
  //   }));
  // };
  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = name === "q" ? e.target.value : [e.target.value];
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  return (
    <Container className="admin-categories">
      <AdminPageTitle />
      <Row className="my-5">
        <Col md={7} className="mb-1">
          <InputGroup className="searchbox">
            <Form.Control
              type="search"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Bir şeyler Yazınız"
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={5} className="mb-1">
          <InputGroup className="selectbox">
            <Form.Select
              name="status"
              value={filters.status[0]}
              onChange={handleFilterChange}
            >
              <option value="">Durum Seçiniz</option>
              <option value="PUBLISHED">Onaylanmış</option>
              <option value="NOT_PUBLISHED">Onaylanmamış</option>
            </Form.Select>
            <Link to="/admin/categories/new-category">
              <Button variant="secondary">Kategori Ekle</Button>
            </Link>
          </InputGroup>
        </Col>
      </Row>
      <DataTable
        columns={columns}
        data={categories}
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
export default AdminCategories;
