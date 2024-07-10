import React, { useState } from "react";
import { Button, ButtonGroup, Card } from "react-bootstrap";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../../../store/slices/cart-slice";
import "./product-card.scss";
import { settings } from "../../../helpers/setting";
import {
  deleteToCart,
  postAddToCart,
  updateToCart,
} from "../../../api/shopping-cart-service";
import { toast } from "../../../helpers/functions/swal";

const ProductCard = (props) => {
  const { id, image, title, discount, price, discountedPrice, stockAmount } =
    props;
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);
  const cartItem = items.find((item) => item.productId === id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [adding, setAdding] = useState(false);
  const [increasing, setIncreasing] = useState(false);
  const [decreasing, setDecreasing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { isUserLogin } = useAppSelector((state) => state.auth);

  const setCartItem = async () => {
    if (!isUserLogin) {
      toast("Lütfen giriş yapınız", "error");
    } else {
      if (quantity < stockAmount) {
        const cartItem = items.find((item) => item.productId === id);
        if (cartItem) {
          plusToItemClick();
        } else {
          addToCartClick();
        }
      } else {
        toast("Stok limiti aşıldı", "warning");
      }
    }
  };

  const addToCartClick = async () => {
    const dto = {
      productId: id,
      quantity: 1,
      updateAt: "",
    };
    setAdding(true);
    try {
      const resp = await postAddToCart(dto);
      setQuantity(1);
      dispatch(addToCart(resp.data.data));
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const plusToItemClick = async () => {
    setIncreasing(true);
    try {
      const resp = await updateToCart("increase", {
        productId: id,
        updateAt: "",
      });
      setQuantity(resp.data.quantity);
      dispatch(incrementQuantity(resp.data.productId));
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setIncreasing(false);
    }
  };

  const minusToItemClick = async () => {
    if (quantity <= 1) {
      setDeleting(true);
      try {
        const resp = await deleteToCart(id);
        setQuantity(0);
        dispatch(removeItem(resp.data.data.productId));
      } catch (err) {
        const message = err.response ? err.response.data.message : err;
        toast(message, "error");
      } finally {
        setDeleting(false);
      }
    } else {
      setDecreasing(true);
      try {
        const resp = await updateToCart("decrease", {
          productId: id,
          updateAt: "",
        });
        setQuantity(resp.data.quantity);
        dispatch(decrementQuantity(resp.data.productId));
      } catch (err) {
        toast(err.response.data.message, "error");
      } finally {
        setDecreasing(false);
      }
    }
  };

  let preview =
    title?.length > 14
      ? title?.substring(0, 14) + "..."
      : title?.substring(0, 14);

  return (
    <Card className="h-100 product-card p-0">
      <Link to={`/shop/${id}`} className="a-link">
        <div className="discount">
          {discount === 0 ? (
            ""
          ) : (
            <Card.Text className="py-2 ">
              <span>%{discount} İndirim</span>
            </Card.Text>
          )}
        </div>
        <div className="stock-amount">
          {stockAmount <= 10 && stockAmount !== 0 ? (
            <Card.Text className="py-2 ">
              <span>Son {stockAmount} ürün!</span>
            </Card.Text>
          ) : stockAmount === 0 ? (
            <Card.Text className="py-2 ">
              <span>Stokta yok!</span>
            </Card.Text>
          ) : (
            ""
          )}
        </div>
        <div className="cargo-free">
          {discountedPrice > 5000 && stockAmount !== 0 ? (
            <Card.Text className="py-2 ">
              <span>Ücretsiz</span>
              <span>Kargo</span>
            </Card.Text>
          ) : (
            ""
          )}
        </div>
        <Card.Img
          variant="top"
          src={`${settings.apiURL}/image/display/${
            image?.find((img) => img?.showcase === true)?.imageId
          }`}
          alt={id}
          className="img-fluid p-5"
        />
      </Link>
      <Card.Body className="text-center">
        <Link to={`/shop/${id}`}>
          {price === 0 ? (
            <div className="coming-soon">
              <span>Teklif İsteyiniz</span>
            </div>
          ) : discount && discount > 0 ? (
            <Card.Subtitle className="discounted">
              <span>
                {discountedPrice?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                TL
              </span>
              <span className="original-price">
                <del>
                  {price?.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                  TL
                </del>
              </span>
            </Card.Subtitle>
          ) : (
            <Card.Subtitle className="non-discount">
              <span>
                {discountedPrice?.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                TL
              </span>
            </Card.Subtitle>
          )}
          <Card.Title className="fs-5 my-3">{preview}</Card.Title>
        </Link>
        {stockAmount === 0 ? (
          <div className="coming-soon">
            <span>Yakinda Gelecek!</span>
          </div>
        ) : quantity > 0 ? (
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={() => minusToItemClick()}
              disabled={decreasing || deleting}
            >
              <AiOutlineMinus />
            </Button>
            <Button variant="secondary" disabled>
              {quantity}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setCartItem()}
              disabled={increasing || adding}
            >
              <AiOutlinePlus />
            </Button>
          </ButtonGroup>
        ) : (
          <Button
            variant="light"
            onClick={() => setCartItem()}
            className="add-button"
            disabled={adding || increasing}
          >
            <span>Sepete Ekle</span>
            <span>
              <AiOutlinePlus />
            </span>
          </Button>
        )}
      </Card.Body>
    </Card>
    // )
  );
};

export default ProductCard;
