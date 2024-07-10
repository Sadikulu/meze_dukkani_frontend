import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import Sidebar from "./sidebar";
import "./favorites.scss";
import { BiTrash } from "react-icons/bi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { settings } from "../../../helpers/setting";
import {
  addFavoriteById,
  deleteUserFavorites,
} from "../../../api/product-service";
import { toast } from "../../../helpers/functions/swal";
import { removeFromFavorite } from "../../../store/slices/favorite-slice";
import {
  postAddToCart,
  updateToCart,
} from "../../../api/shopping-cart-service";
import { addToCart, incrementQuantity } from "../../../store/slices/cart-slice";
import { Link } from "react-router-dom";
import { removeAll } from "../../../store/slices/favorite-slice";

const Favorites = () => {
  const [deleting, setDeleting] = useState(false);
  const [increasing, setIncreasing] = useState(false);
  const [adding, setAdding] = useState(false);
  const { itemFavorites } = useAppSelector((state) => state.favorite);
  const { items } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  const deleteAllFavoriteItems = async () => {
    setDeleting(true);
    try {
      await deleteUserFavorites();
      dispatch(removeAll([]));
      toast("Favori listesi başarıyla temizlendi ", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const deleteFavoriteItem = async (id, dto) => {
    try {
      await addFavoriteById(id);
      dispatch(removeFromFavorite(dto));
      toast("Ürün favori listesinden kaldırıldı", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  const setCartItem = async (id) => {
    const cartItem = items.find((item) => item.productId === id);
    if (cartItem) {
      if (cartItem.quantity < cartItem.stockAmount) {
        plusToItemClick(id);
      } else {
        toast("Stok limiti aşıldı", "warning");
        return;
      }
    } else {
      addToCartClick(id);
    }
  };

  const addToCartClick = async (id) => {
    const dto = {
      productId: id,
      quantity: 1,
      updateAt: "",
    };
    setAdding(true);
    try {
      const resp = await postAddToCart(dto);
      dispatch(addToCart(resp.data.data));
      toast("Ürün eklendi.", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const plusToItemClick = async (id) => {
    setIncreasing(true);
    try {
      const resp = await updateToCart("increase", {
        productId: id,
        updateAt: "",
      });
      dispatch(incrementQuantity(resp.data.productId));
      toast("Ürün başarıyla eklendi", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setIncreasing(false);
    }
  };

  return (
    <Container className="favorites">
      <Row className="favorites-row">
        <Col md={4}>
          <Sidebar />
        </Col>
        <Col md={8} className="favorite">
          {itemFavorites.length === 0 ? (
            <p className="text-center">
              Favori listenize henüz bir ürün eklemediniz.
            </p>
          ) : (
            itemFavorites?.map((product) => (
              <Card key={product.productId}>
                <Row>
                  <Col md={2}>
                    <Link to={`/shop/${product.productId}`}>
                      <Card.Img
                        variant="left"
                        src={`${settings.apiURL}/image/display/${product?.imageId}`}
                        alt={product.productId}
                        className="img-fluid"
                      />
                    </Link>
                  </Col>

                  <Col md={7}>
                    <Card.Title as={Link} to={`/shop/${product.productId}`}>
                      {product.title}
                    </Card.Title>
                  </Col>
                  <Col md={2}>
                    <span
                      onClick={() =>
                        deleteFavoriteItem(product.productId, product)
                      }
                    >
                      <BiTrash />
                    </span>
                    <span
                      onClick={() => setCartItem(product.productId)}
                      disabled={increasing || adding}
                    >
                      <MdOutlineShoppingCart />
                    </span>
                  </Col>
                </Row>
              </Card>
            ))
          )}
          <div
            className={`text-end mt-2 ${
              itemFavorites.length === 0 ? "d-none" : ""
            }`}
          >
            <Button
              variant="secondary"
              disabled={deleting}
              onClick={() => deleteAllFavoriteItems()}
            >
              Hepsini Sil
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Favorites;
