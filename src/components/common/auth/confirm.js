import React, { useEffect, useState } from "react";
import { confirm } from "../../../api/user-service";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./forgot-reset.scss";

const Confirm = () => {
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [confirmData, setConfirmData] = useState([]);
  const [errData, setErrData] = useState([]);
  const [dots, setDots] = useState([]);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token").slice(0, 36);

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await confirm(token);
      setConfirmData(resp.data);
    } catch (err) {
      console.log(err.response.data.message);
      setErrData(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (confirmData?.message) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    } else {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return [...prevDots, "."];
        } else {
          return [];
        }
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container className="forgot-reset">
      <div className="forgot-reset-box">
        <h3>Yönlendiriliyorsunuz</h3>
        <p>{confirmData?.message || errData}</p>
        <h5>
          Yükleniyor{" "}
          {dots.map((dot, index) => (
            <span key={index} style={{ marginRight: "0.2rem" }}>
              {dot}
            </span>
          ))}
        </h5>
      </div>
    </Container>
  );
};

export default Confirm;
