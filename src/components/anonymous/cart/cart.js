import { Button, Container, Table } from "react-bootstrap";
import "./cart.scss";
import {
  AiOutlineCloseCircle,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toast } from "../../../helpers/functions/swal";
import {
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../../../store/slices/cart-slice";
import { settings } from "../../../helpers/setting";
import { deleteToCart, updateToCart } from "../../../api/shopping-cart-service";
import { useState } from "react";

const Cart = () => {
  const { isUserLogin } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [increasing, setIncreasing] = useState(false);
  const [decreasing, setDecreasing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dispatch = useAppDispatch();

  let totalQuantity = 0;

  const getTotalQuantity = () => {
    items.forEach((item) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  };

  const plusToItemClick = async (id) => {
    const selectedItem = items.find((item) => item.productId === id);

    if (selectedItem.quantity < selectedItem.stockAmount) {
      setIncreasing(true);
      try {
        const resp = await updateToCart("increase", {
          productId: id,
          updateAt: "",
        });
        dispatch(incrementQuantity(resp.data.productId));
      } catch (err) {
        toast(err.response.data.message, "error");
      } finally {
        setIncreasing(false);
      }
    } else {
      toast("Stok limiti aşıldı", "warning");
      return;
    }
  };

  const minusToItemClick = async (id) => {
    const itemQuantity = items.filter((item) => item.productId === id);
    if (itemQuantity[0].quantity <= 1) {
      setDeleting(true);
      try {
        const resp = await deleteToCart(id);
        dispatch(removeItem(resp.data.data.productId));
        toast("Ürün başarıyla sepetten kaldırıldı.", "success");
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
        dispatch(decrementQuantity(resp.data.productId));
      } catch (err) {
        toast(err.response.data.message, "error");
      } finally {
        setDecreasing(false);
      }
    }
  };

  const removeItemClick = async (id) => {
    setDeleting(true);
    try {
      const resp = await deleteToCart(id);
      dispatch(removeItem(resp.data.data.productId));
      toast("Ürün başarıyla sepetten kaldırıldı.", "success");
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const subTotal = items
    .reduce(
      (total, item) =>
        (total += item.discount
          ? (item.unitPrice - (item.unitPrice * item.discount) / 100) *
            item.quantity
          : item.quantity * item.unitPrice),
      0
    )
    .toLocaleString("en-US", { maximumFractionDigits: 2 });

  const handleClick = () => {
    toast("Devam etmek için giriş yapmalısınız.", "warning", 4000);
  };
  return (
    <Container className="cart p-5 cart-padding">
      <Table className="table align-middle">
        <thead>
          <tr>
            <th colSpan={2}>Ürün</th>
            <th>Adet</th>
            <th>Tutar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product.productId}>
              <td>
                <Link to={`/shop/${product.productId}`}>
                  <img
                    src={`${settings.apiURL}/image/display/${product.imageId}`}
                    alt={product.productId}
                    className="img-fluid "
                  />
                </Link>
              </td>
              <td>
                <Link
                  to={`/shop/${product.productId}`}
                  style={{ textDecoration: "none" }}
                >
                  {product.title}
                </Link>
              </td>
              <td>
                <span>
                  <AiOutlineMinusCircle
                    onClick={() => minusToItemClick(product.productId)}
                    disabled={decreasing || deleting}
                  />
                </span>
                <span>{product.quantity}</span>
                <span>
                  <AiOutlinePlusCircle
                    onClick={() => plusToItemClick(product.productId)}
                    disabled={increasing}
                  />
                </span>
              </td>
              <td>
                {product.discount
                  ? (
                      (product.unitPrice -
                        (product.unitPrice * product.discount) / 100) *
                      product.quantity
                    ).toLocaleString("en-US", { maximumFractionDigits: 2 })
                  : (product.quantity * product.unitPrice).toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 2,
                      }
                    )}{" "}
                TL
              </td>
              <td>
                <span className="deleteItem">
                  <AiOutlineCloseCircle
                    onClick={() => removeItemClick(product.productId)}
                    disabled={deleting}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td>
              <br />
              <hr />
              <h5>Toplam Tutar</h5>
              <p>
                {getTotalQuantity()}{" "}
                {totalQuantity === 1 || !totalQuantity ? `item` : `items`}
              </p>
            </td>
            <td>
              <b>{subTotal} TL</b>
            </td>
          </tr>
        </tfoot>
      </Table>

      {isUserLogin ? (
        <div className="text-end mt-2">
          <Button
            variant="secondary"
            as={Link}
            to="/user/checkout"
            disabled={subTotal <= 0}
          >
            Ödeme Yap
          </Button>
        </div>
      ) : (
        <div className="text-end mt-5">
          <Button variant="secondary" onClick={handleClick}>
            Ödeme Yap
          </Button>
        </div>
      )}
    </Container>
  );
};
export default Cart;
