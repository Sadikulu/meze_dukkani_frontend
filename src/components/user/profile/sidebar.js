import { useState } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineUser } from "react-icons/ai";
import "./sidebar.scss";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { pathname } = useLocation();

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Navbar expand="md" className="side-bar" expanded={isExpanded}>
      <div className="brand-toggle">
        <Navbar.Brand>
          <AiOutlineUser />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="sidebar-nav" onClick={handleToggle} />
      </div>
      <Navbar.Collapse id="sidebar-nav">
        <Nav>
          <Nav.Link
            as={Link}
            active={pathname === "/user"}
            to={`/user`}
            onClick={handleToggle}
          >
            Profil
          </Nav.Link>
          <Nav.Link
            as={Link}
            active={pathname === "/user/account"}
            to={`/user/account`}
            onClick={handleToggle}
          >
            Hesap
          </Nav.Link>
          <Nav.Link
            as={Link}
            active={pathname === "/user/addresses"}
            to={`/user/addresses`}
            onClick={handleToggle}
          >
            Adres
          </Nav.Link>
          <Nav.Link
            as={Link}
            active={pathname === "/user/favorites"}
            to={`/user/favorites`}
            onClick={handleToggle}
          >
            Favori Listesi
          </Nav.Link>
          <Nav.Link
            as={Link}
            active={pathname === "/user/orders"}
            to={`/user/orders`}
            onClick={handleToggle}
          >
            Siparişler
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Sidebar;
