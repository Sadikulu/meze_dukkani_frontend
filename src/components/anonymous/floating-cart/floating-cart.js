import React from "react";
import "./floating.scss";
import { RiShoppingBagLine } from "react-icons/ri";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";

const FloatingCart = () => {
  const { items } = useAppSelector((state) => state.cart);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/cart");
  };

  let totalQuantity = 0;

  const getTotalQuantity = () => {
    items.forEach((item) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.discount
        ? (item.unitPrice - (item.unitPrice * item.discount) / 100) *
          item.quantity
        : item.quantity * item.unitPrice;
    });
    return totalPrice.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  return (
    <div className="floating-cart">
      <div>
        <span>
          <RiShoppingBagLine />
        </span>
        <span>
          {getTotalQuantity()}{" "}
          {totalQuantity === 1 || !totalQuantity ? `item` : `items`}
        </span>
      </div>
      <Button variant="light" onClick={handleClick}>
        {getTotalPrice()} TL
      </Button>
    </div>
  );
};

export default FloatingCart;
