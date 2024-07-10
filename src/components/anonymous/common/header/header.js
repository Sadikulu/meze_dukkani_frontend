import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../assets/img/logo/logo4.png";
import "./header.scss";
import Menubar from "./menubar";
import { Navbar } from "react-bootstrap";
import Favorites from "./favorite";
import Basket from "./basket";

const Header = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={`header-navbar ${width < 992 ? "" : "fixed-top"}`}>
      <div className="image">
        <Navbar.Brand as={Link} to="/">
          <img src={logo} alt="" className="img-fluid" as={Link} to="/" />
        </Navbar.Brand>
      </div>
      <div className="menu-basket-fav">
        <Menubar />
        <div className="basket-favorite">
          <Favorites />
          <Basket />
        </div>
      </div>
    </div>
  );
};

export default Header;
