import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import "./forgot-reset.scss";

const RegisterMail = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email");

  function getMailService(email) {
    const emailDomain = email.split("@")[1];
    if (emailDomain === "gmail.com") {
      return "https://mail.google.com";
    } else if (emailDomain === "yahoo.com") {
      return "https://mail.yahoo.com";
    } else if (
      emailDomain === "hotmail.com" ||
      emailDomain === "outlook.com" ||
      emailDomain === "live.com" ||
      emailDomain === "msn.com"
    ) {
      return "https://outlook.live.com";
    } else if (emailDomain === "icloud.com" || emailDomain === "me.com") {
      return "https://www.icloud.com";
    } else if (emailDomain === "aol.com") {
      return "https://mail.aol.com";
    } else if (emailDomain === "protonmail.com") {
      return "https://mail.protonmail.com";
    } else if (emailDomain === "zoho.com") {
      return "https://www.zoho.com/mail/";
    } else if (emailDomain === "yandex.com") {
      return "https://mail.yandex.com";
    } else if (emailDomain === "mailru.com") {
      return "https://mail.ru/";
    } else if (emailDomain === "gmx.com") {
      return "https://www.gmx.com/";
    } else {
      return "https://mail.google.com";
    }
  }

  const mailService = getMailService(email);

  return (
    <Container className="forgot-reset">
      <div className="forgot-reset-box">
        <h3>Check Your Email Address</h3>
        <p>
          Kaydınızı tamamlamak için
          <br />
          kayıt işlemi sırasında kullandığınız
          <br />
          <strong>{email}</strong>
          <br />
          mailini lütfen kontrol ediniz.
        </p>
        <p>
          Lütfen maılinizi kontrol ediniz
          <br />
          ve talimatları takip ediniz.
        </p>
        <Row className="g-3">
          <a href={mailService}>
            <Button variant="primary">Maile Git</Button>
          </a>
        </Row>
      </div>
    </Container>
  );
};

export default RegisterMail;
