import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  FaUsers,
  FaBoxes,
  FaClipboardList,
  FaComments,
  FaLayerGroup,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import "./dashboard-card.scss";
import { Link } from "react-router-dom";
import {
  deleteDashboardDatabase,
  getDashboardDatabase,
} from "../../../api/admin-database-service";
import { question, toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";
import { useAppSelector } from "../../../store/hooks";

const DashboardCard = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [database, setDatabase] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getDashboardDatabase();
      const {
        categoryCount,
        contactMessageCount,
        customerCount,
        orderCount,
        productCount,
        reviewCount,
      } = resp.data.data;
      setDatabase({
        categoryCount,
        contactMessageCount,
        customerCount,
        orderCount,
        productCount,
        reviewCount,
      });
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const databaseDelete = async () => {
    setDeleting(true);
    try {
      await deleteDashboardDatabase();
      toast("Veritabanı temizleme başarılı", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeletingDatabase = () => {
    if (user.roles.includes("Administrator")) {
      question(
        "Veritabanını temizlemek istediğinize emin misiniz?",
        "Geri dönüş yok!"
      ).then((result) => {
        if (result.isConfirmed) {
          databaseDelete();
        }
      });
    } else {
      //Kullanıcı yönetici rolüne sahip değilse,uyarı verilebilir
      toast("Sizin veritabanını temizlemeye yetkiniz yok.", "error");
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <Container className="dashboards-card mt-5">
      <Button
        variant="secondary"
        onClick={handleDeletingDatabase}
        disabled={deleting}
        className="btn-database"
        hidden={!user.roles.includes("Administrator")}
      >
        {deleting && <Spinner animation="border" size="sm" />} Veritabanını
        Sıfırla
      </Button>

      <Row className="g-4">
        <Col sm={6} md={4}>
          <Link to="/admin/users">
            <Card>
              <Card.Title>
                <Form.Check label="Kullanıcılar" />
              </Card.Title>
              <span>{database.customerCount}</span>
              <Card.Text>
                <FaUsers />
              </Card.Text>
            </Card>
          </Link>
        </Col>

        <Col sm={6} md={4}>
          <Link to="/admin/categories">
            <Card>
              <Card.Title>
                <Form.Check label="Kategoriler" />
              </Card.Title>
              <span>{database.categoryCount}</span>
              <Card.Text>
                <FaLayerGroup />
              </Card.Text>
            </Card>
          </Link>
        </Col>

        <Col sm={6} md={4}>
          <Link to="/admin/products">
            <Card>
              <Card.Title>
                <Form.Check label="Ürünler" />
              </Card.Title>
              <span>{database.productCount}</span>
              <Card.Text>
                <FaBoxes />
              </Card.Text>
            </Card>
          </Link>
        </Col>

        <Col sm={6} md={4}>
          <Link to="/admin/orders">
            <Card>
              <Card.Title>
                <Form.Check label="Siparişler" />
              </Card.Title>
              <span>{database.orderCount}</span>
              <Card.Text>
                <FaClipboardList />
              </Card.Text>
            </Card>
          </Link>
        </Col>

        <Col sm={6} md={4}>
          <Link to="/admin/reviews">
            <Card>
              <Card.Title>
                <Form.Check label="Yorumlar" />
              </Card.Title>
              <span>{database.reviewCount}</span>
              <Card.Text>
                <FaComments />
              </Card.Text>
            </Card>
          </Link>
        </Col>

        <Col sm={6} md={4}>
          <Link to="/admin/contact-messages">
            <Card>
              <Card.Title>
                <Form.Check label="Mesajlar" />
              </Card.Title>
              <span>{database.contactMessageCount}</span>
              <Card.Text>
                <FaEnvelopeOpenText />
              </Card.Text>
            </Card>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardCard;
