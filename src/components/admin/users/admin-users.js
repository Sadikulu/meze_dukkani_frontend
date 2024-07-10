import React, { useState, useEffect } from "react";
import { Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./admin-users.scss";
import DataTable from "react-data-table-component";
import { getUsersByPage } from "../../../api/user-service";
import { toast } from "../../../helpers/functions/swal";
import AdminPageTitle from "../common/admin-page-title";

const columns = [
  {
    selector: (row) => `${row.firstName}, ${row.lastName}`,
  },
  {
    selector: (row) => row.email,
  },
  {
    selector: (row) => row.phone,
  },
  {
    selector: (row) => row.roles.join(" - "),
  },
];

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({
    q: "",
    role: [],
  });
  const navigate = useNavigate();

  const loadData = async (page) => {
    setLoading(true);
    try {
      const resp = await getUsersByPage(
        filters.q,
        filters.role[0],
        page,
        perPage
      );
      const { content, totalElements } = resp.data;
      setUsers(content);
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
      const resp = await getUsersByPage(
        filters.q,
        filters.role[0],
        page - 1,
        newPerPage
      );
      const { content } = resp.data;
      setUsers(content);
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
    navigate(`/admin/users/${row.id}`);
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
    const value = name === "q" ? e.target.value : [e.target.value];
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <Container className="admin-users">
      <AdminPageTitle />
      <Row className="my-5">
        <Col md={9} className="mb-1">
          <InputGroup className="searchbox">
            <Form.Control
              type="search"
              placeholder="Bir şeyler yazınız"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
        <Col md={3} className="mb-1">
          <InputGroup className="selectbox">
            <Form.Select
              name="role"
              value={filters.role[0]}
              onChange={handleFilterChange}
            >
              <option value="">Rol Seçiniz</option>
              <option value="ROLE_CUSTOMER">Kullanıcı</option>
              <option value="ROLE_ADMIN">Yönetici</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <DataTable
            title=""
            columns={columns}
            data={users}
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

export default AdminUsers;
