import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { deleteMessage, getMessage } from "../../../api/contact-service";
import { question, toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";
import "./contact-message-edit.scss";
import AdminPageTitle from "../common/admin-page-title";

const ContactMessageEdit = () => {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { messageId } = useParams();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const resp = await getMessage(messageId);
      setMessage(resp.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const removeMessage = async () => {
    setDeleting(true);
    try {
      await deleteMessage(messageId);
      toast("Mesaj Silindi", "success");
      navigate(-1);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = () => {
    question("Silmek istediğinize emin misiniz?", "Geri dönüş yok!").then(
      (result) => {
        if (result.isConfirmed) {
          removeMessage();
        }
      }
    );
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="admin-contact-message">
      <AdminPageTitle titleEdit={message.name} />
      {loading ? (
        <Loading />
      ) : (
        <Row className="mt-5">
          <h5>{message.subject}</h5>
          <p className="my-4">{message.body}</p>
          <hr />
          <p>
            <em>
              {message.name} - {message.email}
            </em>
          </p>

          <div className="text-end">
            <ButtonGroup className="mt-5">
              <Button variant="secondary" onClick={() => navigate(-1)}>
                İptal
              </Button>
              <Button
                variant="primary"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting && <Spinner animation="border" size="sm" />} Sil
              </Button>
            </ButtonGroup>
          </div>
        </Row>
      )}
    </Container>
  );
};

export default ContactMessageEdit;
