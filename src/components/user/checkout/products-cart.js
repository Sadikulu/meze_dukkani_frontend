import React from "react";
import { Container, Table } from "react-bootstrap";
import "../../anonymous/cart/cart.scss";
import { useAppSelector } from "../../../store/hooks";
import { settings } from "../../../helpers/setting";
import Loading from "../../common/loading/loading";

const ProductsCart = ({ loading, discountAmount }) => {
  const { items } = useAppSelector((state) => state.cart);

  let totalQuantity = 0;

  const getTotalQuantity = () => {
    items.forEach((item) => {
      totalQuantity += item.quantity;
    });
    return totalQuantity;
  };

  const subTotal = items
    .reduce((total, item) => (total += item.quantity * item.unitPrice), 0)
    .toFixed(2);

  const tax = items
    .reduce(
      (total, index) =>
        (total += (index.discountedPrice * index.quantity * index.tax) / 100),
      0
    )
    .toFixed(2);

  const discounts = Number(
    items.reduce(
      (item, index) =>
        (item += Number(
          (index.quantity * index.unitPrice * index.discount) / 100
        )),
      0
    )
  ).toFixed(2);

  const couponDiscount = Number(discountAmount).toFixed(2);

  const grandTotalNoneShipping = Number(
    Number(
      (
        Number(subTotal) -
        Number(discounts) -
        Number(couponDiscount) +
        Number(tax)
      ).toFixed(2)
    )
  );

  let shippingPrice = 0;
  if (
    Number(grandTotalNoneShipping) <= 0 ||
    Number(grandTotalNoneShipping) === undefined
  ) {
    shippingPrice = 0;
  } else if (Number(grandTotalNoneShipping) <= 750) {
    shippingPrice = 5;
  } else if (Number(grandTotalNoneShipping) <= 1500) {
    shippingPrice = 15;
  } else if (Number(grandTotalNoneShipping) <= 3000) {
    shippingPrice = 25;
  } else if (Number(grandTotalNoneShipping) <= 5000) {
    shippingPrice = 35;
  } else {
    shippingPrice = 0;
  }

  const grandTotal = Number(
    Number(subTotal) -
      Number(discounts) -
      Number(couponDiscount) +
      Number(tax) +
      Number(shippingPrice)
  ).toFixed(2);

  return loading ? (
    <Loading />
  ) : (
    <Container className="cart p-5 cart-padding">
      <Table responsive className="align-middle mb-5">
        <thead>
          <tr>
            <th colSpan={2}>Ürün</th>
            <th>Adet</th>
            <th>Toplam</th>
          </tr>
        </thead>
        <tbody>
          {items.map((product) => (
            <tr key={product.id}>
              <td>
                <img
                  src={`${settings.apiURL}/image/display/${product.imageId}`}
                  alt={product.id}
                  className="img-fluid"
                />
              </td>
              <td>{product.title}</td>
              <td>
                <span>{product.quantity}</span>
              </td>
              <td>
                {(product.quantity * product.unitPrice).toLocaleString(
                  "en-US",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                TL
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <table className="sub-tax-discount-grand">
        <tbody>
          <tr>
            <td>
              <span>
                {getTotalQuantity()}
                {totalQuantity === 1 || !totalQuantity ? ` item` : ` items`}
              </span>
              ToplamTutar
            </td>
            <td>İndirim</td>
            <td>Kupon İndirimi</td>
            <td>KDV</td>
            <td>Kargo Ücreti</td>
            <td>Genel Toplam</td>
          </tr>
          <tr>
            <td>
              <b>{subTotal} TL</b>
            </td>
            <td>
              <b>{discounts} TL</b>
            </td>
            <td>
              <b>{couponDiscount} TL</b>
            </td>
            <td>
              <b>{tax} TL</b>
            </td>
            <td>
              <b>{shippingPrice.toFixed(2)} TL</b>
            </td>
            <td>
              <b>{grandTotal} TL</b>
            </td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
};
export default ProductsCart;
