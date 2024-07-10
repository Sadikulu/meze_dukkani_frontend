import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { settings } from "../../../helpers/setting";
import { AiFillPhone, AiOutlineMail, AiOutlineWhatsApp } from "react-icons/ai";
import Map from "./map";
import Spacer from "../../common/spacer/spacer";
import contact from "../../../assets/img/contact/contact.png";
import "./contact.scss";
import ContactMessage from "./contact-message";

const Contact = () => {
  return (
    <div className="contact-message">
      <Container>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Header>
                <AiFillPhone />
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <a href={`tel:${settings.phone1}`}>{settings.phone1}</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <AiOutlineWhatsApp />
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <a href={`https://wa.me/${settings.whatsapp}`}>
                    {settings.whatsapp}
                  </a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>
                <AiOutlineMail />
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="img-form">
          <Col md={4}>
            <img src={contact} alt="contact" />
          </Col>
          <Col md={4} sm={6}>
            <p>
              Herhangi bir sorunuz, yorumunuz veya endişeniz varsa bizimle
              iletişime geçebilirsiniz. Müşteri hizmetleri ekibimiz aklınıza
              takılan tüm sorularda size yardımcı olmak için 7/24 hizmettedir.
              Telefonla, e-postayla veya mesaj ile bize ulaşabilirsiniz. Biz
              geri bildiriminize değer veriyoruz ve müşterilerimize mümkün olan
              en iyi hizmeti sunmaya çalışıyoruz. Memnuniyetiniz bizim
              önceliğimizdir ve biz tüm meze ihtiyaçlarınız için size hizmet
              vermeyi sabırsızlıkla bekliyoruz.
            </p>
          </Col>
          <Col md={4} sm={6}>
            <ContactMessage />
          </Col>
        </Row>
        <Spacer />
      </Container>
      <Map />
    </div>
  );
};
export default Contact;
