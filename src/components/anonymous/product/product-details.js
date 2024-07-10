import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  ButtonGroup,
} from "react-bootstrap";
import Spacer from "../../common/spacer/spacer";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import {
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./product-details.scss";
import Comments from "./comments";
import Loading from "../../common/loading/loading";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../../../store/slices/cart-slice.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getFeaturedProducts,
  getProductById,
} from "../../../api/product-service";
import { toast } from "../../../helpers/functions/swal";
import { settings } from "../../../helpers/setting";
import { getReviewsProductById } from "../../../api/review-services";
import {
  deleteToCart,
  postAddToCart,
  updateToCart,
} from "../../../api/shopping-cart-service";
import { addFavoriteById } from "../../../api/product-service";
import {
  addToFavorite,
  removeFromFavorite,
} from "../../../store/slices/favorite-slice";
import FeaturedProducts from "./featured-products";

const ProductDetails = () => {
  const [products, setProducts] = useState([]);
  const {
    image, //shortDesc,
    title,
    id,
    stockAmount,
    discountedPrice,
  } = products;
  const { items } = useAppSelector((state) => state.cart);
  const cartItem = items.find((item) => item.productId === id);
  const initialQuantity = cartItem ? cartItem.quantity : 0;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviewsData, setReviewsData] = useState([]);
  const [paging, setPaging] = useState({});
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shopId } = useParams();
  const { isUserLogin } = useAppSelector((state) => state.auth);
  const { itemFavorites } = useAppSelector((state) => state.favorite);
  // const favoriteList = itemFavorites.map((item) => item.productId);
  const [isFavorite, setIsFavorite] = useState();
  // isUserLogin && favoriteList.includes(Number(shopId))
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [isImageHovered, setIsImageHovered] = useState(false);
  const loadData = async (page) => {
    try {
      const resp = await getProductById(shopId);
      setProducts(resp.data);
      //yenı bır urun eklendıgınde favorıte olup olmadıgını kontrol etme
      const favoriteList = itemFavorites.map((item) => item.productId);
      const isCurrentlyFavorite = favoriteList.includes(Number(shopId));
      setIsFavorite(isCurrentlyFavorite);
      const respReviews = await getReviewsProductById(shopId, page);
      const { content, totalPages, pageable } = respReviews.data;
      setReviewsData(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
      const respFeatured = await getFeaturedProducts();
      setFeaturedProducts(respFeatured.data.content);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [shopId]);
  const showcaseIndex = image?.findIndex((img) => img.showcase === true);

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
    try {
      const resp = await postAddToCart(dto);
      setQuantity(1);
      dispatch(addToCart(resp.data.data));
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  const plusToItemClick = async () => {
    try {
      const resp = await updateToCart("increase", {
        productId: id,
        updateAt: "",
      });
      setQuantity(resp.data.quantity);
      dispatch(incrementQuantity(resp.data.productId));
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };

  const minusToItemClick = async () => {
    if (quantity <= 1) {
      try {
        const resp = await deleteToCart(id);
        setQuantity(0);
        dispatch(removeItem(resp.data.data.productId));
      } catch (err) {
        const message = err.response ? err.response.data.message : err;
        toast(message, "error");
      }
    } else {
      try {
        const resp = await updateToCart("decrease", {
          productId: id,
          updateAt: "",
        });
        setQuantity(resp.data.quantity);
        dispatch(decrementQuantity(resp.data.productId));
      } catch (err) {
        toast(err.response.data.message, "error");
      }
    }
  };

  const totalRating = reviewsData.reduce(
    (acc, comment) => acc + comment.rating,
    0
  );

  const numComments = reviewsData.length;

  const averageRating = numComments
    ? (totalRating / numComments).toFixed(1)
    : 0;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  const stars = Array.from({ length: 5 }, (_, index) => {
    if (index < fullStars) {
      return <FaStar key={`star-${index}`} />;
    } else if (hasHalfStar && index === fullStars) {
      return <FaStarHalfAlt key="half-star" />;
    } else {
      return <FaRegStar key={`empty-star-${index}`} />;
    }
  });

  const handleToggleFavorite = async () => {
    try {
      const resp = await addFavoriteById(id);

      const favoriteTitle = resp.data.data.title;
      const favoriteId = resp.data.data.id;
      const favoriteImage = image.find((img) => img.showcase === true);
      const favoriteImageId = favoriteImage.imageId;

      const dto = {
        title: favoriteTitle,
        productId: favoriteId,
        imageId: favoriteImageId,
      };

      if (isFavorite) {
        dispatch(removeFromFavorite(dto));
        setIsFavorite(false);
      } else {
        dispatch(addToFavorite(dto));
        setIsFavorite(true);
      }
      toast(resp.data.message, "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    }
  };
  const handleImageMouseEnter = () => {
    setIsImageHovered(true);
  };

  const handleImageMouseLeave = () => {
    setIsImageHovered(false);
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="allProduct-details">
      <Container className="product-details">
        <Row className="row-swiper">
          <Col md={6} className="swiper-col ">
            <Swiper
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#fff",
              }}
              loop={true}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper1"
              initialSlide={showcaseIndex}
            >
              {image?.map((img, i) => (
                <SwiperSlide key={i}>
                  <Card
                    className="swiper-slide-image-container"
                    onMouseEnter={handleImageMouseEnter}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      src={`${settings.apiURL}/image/display/${img.imageId}`}
                      alt=""
                      className="img-fluid"
                    />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
            <Swiper
              onClick={setThumbsSwiper}
              loop={true}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2 "
            >
              {image.map((img, i) => (
                <SwiperSlide key={i}>
                  <Card
                    className="swiper-slide-image-container"
                    onMouseEnter={handleImageMouseEnter}
                    onMouseLeave={handleImageMouseLeave}
                  >
                    <img
                      src={`${settings.apiURL}/image/display/${img.imageId}`}
                      alt=""
                      className="img-fluid"
                    />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
          <Col md={6} className="content-col ">
            <h2>{title}</h2>
            <div className="stars-comments mt-3">
              <span className="stars">{stars}</span>
              <div className="score-comment">
                <span>{averageRating} </span> | <span>{numComments}</span>
                <span>
                  <Link
                    to={`/shop/${shopId}?key=comments`}
                    onClick={() => window.scrollTo(0, 850)}
                  >
                    Yorumlar
                  </Link>
                </span>
              </div>
            </div>
            <div className="stock-amount-cargo-free  mt-3">
              <div className="stock-amount">
                {stockAmount <= 10 && stockAmount !== 0 ? (
                  <span>Son {stockAmount} ürün!</span>
                ) : stockAmount === 0 ? (
                  <span>Stokta yok!</span>
                ) : (
                  ""
                )}
              </div>
              <div className="cargo-free">
                {discountedPrice > 5000 && stockAmount !== 0 ? (
                  <div className="py-2 ">
                    <span>Ücretsiz</span>
                    <span>Kargo</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <Spacer height={50} />
            <div className="price-heart">
              <div className="price">
                <div>
                  <span>
                    <del>
                      {products.discount === 0 ? "" : products.price + " TL"}
                    </del>
                  </span>
                  <h2>
                    {products.price === 0 ? (
                      <div className="coming-soon">
                        <a
                          href={`https://wa.me/${settings.whatsapp}?text=Merhaba`}
                        >
                          <AiOutlineWhatsApp /> Teklif İsteyiniz
                        </a>
                      </div>
                    ) : (
                      <strong>{products.discountedPrice.toFixed(2)} TL</strong>
                    )}
                  </h2>
                </div>
              </div>
              <div className="heart">
                {isUserLogin ? (
                  isFavorite ? (
                    <AiFillHeart onClick={handleToggleFavorite} />
                  ) : (
                    <AiOutlineHeart onClick={handleToggleFavorite} />
                  )
                ) : (
                  <AiOutlineHeart
                    onClick={() => !isUserLogin && navigate("/login")}
                  />
                )}
              </div>
            </div>
            <Spacer height={50} />
            {stockAmount === 0 ? (
              <div className="coming-soon">
                <span>Yakında Gelecek!</span>
              </div>
            ) : quantity > 0 ? (
              <ButtonGroup>
                <Button variant="secondary" onClick={() => minusToItemClick()}>
                  <AiOutlineMinus />
                </Button>
                <Button variant="secondary" disabled>
                  {quantity}
                </Button>
                <Button variant="secondary" onClick={() => setCartItem()}>
                  <AiOutlinePlus />
                </Button>
              </ButtonGroup>
            ) : (
              <Button
                variant="light"
                onClick={() => setCartItem()}
                className="add-button"
              >
                <span>
                  <span>
                    <AiOutlinePlusCircle />
                  </span>
                  Sepete Ekle
                </span>
              </Button>
            )}
            <Spacer height={50} />
            <Card className="shipping">
              {/* {shortDesc ? (
                <p>{shortDesc} </p>
              ) :  */}
              (
              <>
                <h4>Kargo</h4>
                <hr />
                {/* <p>
                    <TiLocationArrowOutline />
                    <span>Fedex-Free to ship</span>
                  </p> */}
                <p>En geç iki gün içinde gönderilecektir</p>
              </>
              ){/* } */}
            </Card>
          </Col>
        </Row>
        <Spacer />
        <Comments
          products={products}
          reviewsData={reviewsData}
          paging={paging}
          loadData={loadData}
        />
        <Spacer />
        <FeaturedProducts featuredProducts={featuredProducts} />
      </Container>
    </div>
  );
};
export default ProductDetails;
