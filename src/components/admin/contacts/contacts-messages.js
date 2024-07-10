import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { getMessagesByPage } from "../../../api/contact-service";
import "./contacts-messages.scss";
import AdminPageTitle from "../common/admin-page-title";
import { Container, Form, InputGroup, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const columns = [
  {
    name: "Subject",
    selector: (row) => row.subject,
    sortable: true,
  },
  {
    name: "Visitor",
    selector: (row) => row.name,
    sortable: true,
  },
];

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const loadData = async (page) => {
    try {
      const resp = await getMessagesByPage(page, perPage);
      const { content, totalElements } = resp.data;
      setMessages(content);
      setTotalRows(totalElements);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    try {
      const resp = await getMessagesByPage(page - 1, newPerPage);
      const { content } = resp.data;
      setMessages(content);
      setPerPage(newPerPage);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    loadData(page - 1);
  };

  const handleRowClicked = (row) => {
    navigate(`/admin/contact-messages/${row.id}`);
  };

  useEffect(() => {
    loadData(0);
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="admin-contact-messages">
      <AdminPageTitle />
      <Row className="my-5">
        <InputGroup>
          <Form.Control
            type="search"
            placeholder="Bir şeyler yaz"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
        </InputGroup>
      </Row>
      <DataTable
        columns={columns}
        // eslint-disable-next-line
        data={messages.filter((item) => {
          if (searchTerm === "") {
            return item;
          } else if (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return item;
          }
        })}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        onRowClicked={handleRowClicked}
      />
    </Container>
  );
};

export default ContactMessages;
