import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo3 from "../../../assets/img/logo/logo3.png";
import {
  encryptedLocalStorage,
  encryptedSessionStorage,
} from "../../../helpers/functions/encrypt-storage";
import { question } from "../../../helpers/functions/swal";
import { useAppDispatch } from "../../../store/hooks";
import { logout } from "../../../store/slices/auth-slice";
import "./sidebar.scss";
import { setCart } from "../../../store/slices/cart-slice";
const SideBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleLogout = () => {
    question("Çıkış", "Çıkış yapmak istediğinize emin misiniz?").then(
      (result) => {
        if (result.isConfirmed) {
          dispatch(logout());
          dispatch(setCart([]));
          encryptedLocalStorage.removeItem("token");
          encryptedSessionStorage.removeItem("token");
          localStorage.removeItem("cartUUID");
          sessionStorage.removeItem("cartUUID");
          navigate("/");
          window.location.reload();
        }
      }
    );
  };
  return (
    <Navbar bg="primary" expand="lg" className="admin-navbar" variant="dark">
      <Container>
        {/* <Navbar.Brand as={Link} to="/">
          <img src={logo3} alt="AdminPanelLogo" />
        </Navbar.Brand> */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/admin" active={pathname === "/admin"}>
              Gösterge Paneli
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/products"
              active={pathname === "/admin/products"}
            >
              Ürünler
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/categories"
              active={pathname === "/admin/categories"}
            >
              Kategoriler
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/users"
              active={pathname === "/admin/users"}
            >
              Kullanıcılar
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/reviews"
              active={pathname === "/admin/rewiews"}
            >
              Yorumlar
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/contact-messages"
              active={pathname === "/admin/contact-messages"}
            >
              İletişim Mesajları
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/orders"
              active={pathname === "/admin/orders"}
            >
              Siparişler
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/admin/reports"
              active={pathname === "/admin/reports"}
            >
              Çıktılar
            </Nav.Link>

            <Nav.Link as={Link} to="/">
              Web Sitesi
            </Nav.Link>

            <Nav.Link onClick={handleLogout}> Çıkış</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default SideBar;
