import React, { Fragment, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Pagination,
  Row,
} from "react-bootstrap";
import {
  FaBalanceScaleLeft,
  FaBarcode,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { TbLayout2 } from "react-icons/tb";
import { HiOutlineBellAlert } from "react-icons/hi2";
import { Link } from "react-router-dom";
import "./products.scss";
import { getProductsByPage } from "../../../api/product-service";
import { getCategoriesOption } from "../../../api/category-service";
import { toast } from "../../../helpers/functions/swal";
import { settings } from "../../../helpers/setting";
import Loading from "../../common/loading/loading";
import AdminPageTitle from "../common/admin-page-title";
import { handleClickPriceInc } from "../../../helpers/functions/sorty-by";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [sortValue, setSortValue] = useState("id");
  const [directionValue, setDirectionValue] = useState("DESC");
  const [categoryIdData, setCategoryIdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paging, setPaging] = useState({});
  const [filters, setFilters] = useState({ q: "", categories: [] });

  const loadData = async () => {
    try {
      const categoryResp = await getCategoriesOption();
      setCategoryIdData(categoryResp.data);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async (page) => {
    try {
      const resp = await getProductsByPage({
        q: filters.q,
        categories: filters.categories,
        page,
        sort: sortValue,
        direction: directionValue,
      });
      const { content, totalPages, pageable } = resp.data;
      setProducts(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getProducts(0);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line
  }, [filters, sortValue, directionValue]);

  const handleFilterChange = (e) => {
    const name = e.target.name;
    const value = name === "q" ? e.target.value : [e.target.value];

    setFilters((prevFilters) => ({
      ...prevFilters,

      [name]: value,
    }));
  };

  return (
    <Container className="admin-products">
      <AdminPageTitle />
      <Row className="mt-5">
        <Col md={12} className="mb-1">
          <InputGroup>
            <Form.Control
              type="search"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Bir şeyler yazınız"
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Link to="/admin/products/new-product">
              <Button variant="secondary">Yeni Ürün</Button>
            </Link>
          </InputGroup>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4}>
          <Form.Select
            name="categories"
            value={filters.categories[0]}
            onChange={handleFilterChange}
          >
            <option value="">Kategori Seçiniz</option>
            {categoryIdData.map((option, i) => {
              return (
                <option className="py-2" value={option.id} key={i}>
                  {option.title}
                </option>
              );
            })}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            name="sort"
            onChange={(e) =>
              handleClickPriceInc(
                e.target.value,
                setSortValue,
                setDirectionValue
              )
            }
          >
            <option value="">Sırala</option>
            <option value="lowest">Fiyat (Azalan)</option>
            <option value="highest">Fiyat (Artan)</option>
            <option value="oldest">Eski</option>
            <option value="newest">Yeni</option>
            <option value="a-z"> (A-Z)</option>
            <option value="z-a">(Z-A)</option>
          </Form.Select>
        </Col>
      </Row>
      {loading ? (
        <Loading />
      ) : (
        <>
          {products.map((product, i) => (
            <Link to={`/admin/products/${product.id}`} key={i}>
              <Card>
                <Row className="content">
                  <Col md={2}>
                    <Card.Img
                      variant="left"
                      src={`${settings.apiURL}/image/display/${
                        product.image.find((img) => img.showcase === true)
                          ?.imageId
                      }`}
                      alt={product.id}
                      className="img-fluid"
                    />
                  </Col>
                  <Col md={8}>
                    <Card.Title>{product.title}</Card.Title>
                    <Row>
                      <Col xs={6} sm={4}>
                        <TbLayout2 /> <span>{product.category.title}</span>
                      </Col>
                      <Col xs={6} sm={4}>
                        <FaBalanceScaleLeft />{" "}
                        <span
                          style={{
                            color:
                              product.stockAmount === product.stockAlarmLimit
                                ? "rgb(230, 57, 70)"
                                : "inherit",
                          }}
                        >
                          {product.stockAmount}
                        </span>
                      </Col>
                      <Col xs={6} sm={4}>
                        <FaBarcode /> <span>{product.sku}</span>
                      </Col>
                      <Col xs={6} sm={4}>
                        <FaCheck /> <span>{product.status}</span>
                      </Col>
                      <Col xs={6} sm={4}>
                        <HiOutlineBellAlert />{" "}
                        <span>{product.stockAlarmLimit}</span>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={2}>
                    <Card.Title>
                      {Number(product.price).toFixed(2)} TL
                    </Card.Title>
                  </Col>
                </Row>
              </Card>
              <hr />
            </Link>
          ))}
          {paging.totalPages > 1 && (
            <Row className="mt-5 justify-content-center">
              <Pagination className="pagination">
                {paging.pageNumber > 0 && (
                  <>
                    <Pagination.First onClick={() => getProducts(0)} />
                    <Pagination.Prev
                      onClick={() => getProducts(paging.pageNumber - 1)}
                    />
                  </>
                )}
                {paging.pageNumber > 2 && (
                  <Pagination.Ellipsis
                    onClick={() => getProducts(paging.pageNumber - 2)}
                  />
                )}
                {[...Array(paging.totalPages)].map((item, index) => (
                  <Fragment key={index}>
                    {index === paging.pageNumber && (
                      <Pagination.Item active>{index + 1}</Pagination.Item>
                    )}
                    {index !== paging.pageNumber &&
                      index >= Math.max(0, paging.pageNumber - 1) &&
                      index <=
                        Math.min(
                          paging.totalPages - 1,
                          paging.pageNumber + 1
                        ) && (
                        <Pagination.Item
                          key={index}
                          onClick={() => getProducts(index)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      )}
                  </Fragment>
                ))}
                {paging.pageNumber < paging.totalPages - 3 && (
                  <Pagination.Ellipsis
                    onClick={() => getProducts(paging.pageNumber + 2)}
                  />
                )}
                {paging.pageNumber < paging.totalPages - 1 && (
                  <>
                    <Pagination.Next
                      onClick={() => getProducts(paging.pageNumber + 1)}
                    />
                    <Pagination.Last
                      onClick={() => getProducts(paging.totalPages - 1)}
                    />
                  </>
                )}
              </Pagination>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
