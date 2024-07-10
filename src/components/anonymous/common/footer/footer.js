import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./footer.scss";
//import logo from "../../../../assets/img/logo/logo3.png";
import { settings } from "../../../../helpers/setting";
import { BsTelephone } from "react-icons/bs";
import { BiNavigation } from "react-icons/bi";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
// import payment from "../../../../assets/img/payment/payment-logos.png";

const Footer = () => {
  const { pathname } = useLocation;

  return (
    <footer className="footer">
      <Container>
        <Row className="footer-top g-5 mx-0">
          {/* <Col sm={6} lg={3}>
            <Link to="/">
              <img src={logo} alt={settings.siteName} className="img fluid" />
            </Link>
          </Col> */}
          <Col sm={6} lg={5}>
            <h5>Hakkımızda</h5>
            <p>
              Biz, lezzetin sınırlarını zorlayan bir meze markasıyız. Geleneksel
              Türk mutfağının izinden giderek, en özel mezeleri sizin için
              hazırlıyoruz. İyi yemekle iyi bir anı bir araya getirmek için
              buradayız. Mezelerimizde kullandığımız her malzeme, tazelik ve
              kaliteye odaklanarak seçilir. Şeflerimizin titiz çalışması ve
              lezzet yolculuğumuzun her aşamasında dikkatli bir şekilde izlediği
              tariflerimiz, damak zevkinize hitap edecek eşsiz tatlar sunar.
              Biz, sizi lezzet dolu bir yolculuğa çıkarmak için buradayız.
              İnternet sitemizdeki her siparişinizde, günlük yaşamın
              yoğunluğundan uzaklaşarak, en sevdiğiniz mezelerin tadını
              çıkarabilirsiniz. Lezzetlerimizle dolu bir dünyayı size sunmaktan
              mutluluk duyuyoruz. İyi yemek ve kaliteli hizmetten ödün vermeden,
              sizin için buradayız. Bizi tercih ettiğiniz için teşekkür ederiz.
              Birlikte lezzet dolu anlar yaşamak için sabırsızlanıyoruz.
            </p>
          </Col>

          <Col sm={6} lg={2}>
            <h5>Hızlı Erişim</h5>
            <ul>
              <li>
                <Link to="/" className={pathname === "/" ? "active" : ""}>
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  className={pathname === "shop" ? "active" : ""}
                >
                  Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={pathname === "/contact" ? "active" : ""}
                >
                  İletişim
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className={pathname === "/privacy-policy" ? "active" : ""}
                >
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </Col>

          <Col sm={6} lg={2}>
            <h5>İletişim</h5>
            <ul>
              <li>
                <a href={`tel:${settings.phone1}`}>
                  <BsTelephone /> {settings.phone1}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${settings.whatsapp}?text=Merhaba`}>
                  <AiOutlineWhatsApp /> {settings.whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`}>
                  <HiOutlineMail /> {settings.email}
                </a>
              </li>
              <li>
                <a href={settings.mapUrl} target="_blank" rel="noreferrer">
                  <BiNavigation /> {settings.address}
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className="g-1 footer-bottom">
          <Col lg={5} class="text-end">
            <h6>© {new Date().getFullYear()} - Copyright by KSS Bilişim</h6>
          </Col>

          {/* <Col lg={7}>
            <img src={payment} alt={settings.siteName} className="img fluid" />
          </Col> */}
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
