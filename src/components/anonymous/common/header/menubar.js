import React, { useEffect, useState } from "react";
import { Container, Dropdown, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AiOutlineHome, AiOutlineShop } from "react-icons/ai";
import { BiMap } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserMenu from "./user-menu";
import { toast } from "../../../../helpers/functions/swal";
import { getCategoriesByPage } from "../../../../api/category-service";

const Menubar = () => {
  const [categoryIdData, setCategoryIdData] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  //1-once url e tıklanan category eklendi
  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?categories=${categoryId}`);
  };

  const loadData = async () => {
    try {
      const categoryResp = await getCategoriesByPage();
      setCategoryIdData(categoryResp.data.content);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="menubar">
      <Navbar expand="lg">
        <Container className="ps-0">
          <Navbar.Toggle className="toggle" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                active={pathname === "/"}
                className="me-2"
              >
                <AiOutlineHome />
                Ana Sayfa
              </Nav.Link>
              <NavDropdown
                title={
                  <span>
                    <AiOutlineShop /> Tüm Ürünler
                  </span>
                }
                className="shop-icon "
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/shop">
                  Tüm Kategoriler
                </NavDropdown.Item>
                <Dropdown.Divider />
                {categoryIdData.map((category) => (
                  <NavDropdown.Item
                    as={Link}
                    to={`/shop?categories=${category.id}`}
                    onClick={() => handleCategoryClick(category.id)}
                    key={category.id}
                  >
                    {category.title}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link
                as={Link}
                to="/contact"
                active={pathname === "/contact"}
                className="me-4"
              >
                <BiMap />
                İletişim
              </Nav.Link>
              <UserMenu />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Menubar;
