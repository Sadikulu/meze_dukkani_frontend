import React from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { SlBasket } from "react-icons/sl";
import { useAppSelector } from "../../../../store/hooks";
import "./header.scss";
const Basket = () => {
  const { items } = useAppSelector((state) => state.cart);
  const { pathname } = useLocation();

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Button
      className="btn btn-basket "
      as={Link}
      to="/cart"
      active={pathname === "/cart"}
    >
      <SlBasket />
      <span> {getTotalQuantity()} </span>
    </Button>
  );
};

export default Basket;
