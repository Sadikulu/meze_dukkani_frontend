import React from "react";
import { Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { useAppSelector } from "../../../../store/hooks";
import "./header.scss";
const Favorites = () => {
  const { itemFavorites } = useAppSelector((state) => state.favorite);
  const { pathname } = useLocation();

  return (
    <Button
      className="btn btn-favorite "
      as={Link}
      to="/user/favorites"
      active={pathname === "/user/favorites"}
    >
      <AiOutlineHeart />
      <span> {itemFavorites.length} </span>
    </Button>
  );
};

export default Favorites;
