import React, { useState, useEffect, Fragment } from "react";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import CheckFilter from "./check-filter";
import SearchFilter from "./search-filter";
import ShopProducts from "./shop-products";
import ShopProductsLayout from "./shop-products-layout";
import "./shop.scss";
import { getCategoriesByPage } from "../../../api/category-service";
import { getProductsByPage } from "../../../api/product-service";
import { toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";
import { useSearchParams } from "react-router-dom";

const Shop = () => {
  const [categoryIdData, setCategoryIdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [paging, setPaging] = useState({});
  const [activepage, setactivepage] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [sortValue, setSortValue] = useState("id");
  const [directionValue, setDirectionValue] = useState("DESC");
  const [showMessage, setShowMessage] = useState();
  const [filters, setFilters] = useState({
    q: "",
    categories: [],
    minPrice: "",
    maxPrice: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const categoryResp = await getCategoriesByPage();
      setCategoryIdData(categoryResp.data.content);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async (page) => {
    setIsLoading(true);
    try {
      const resp = await getProductsByPage({
        q: encodeURI(filters.q),
        categories: filters.categories,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        page,
        sort: sortValue,
        direction: directionValue,
      });
      let { content, totalPages, pageable } = resp.data;
      setProducts(content);
      setPaging({ totalPages, pageNumber: pageable.pageNumber });
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };
  const handleFiltersChange = (e) => {
    const { name, value, checked } = e.target;
    let updatedFilters = {};
    if (name === "q") {
      updatedFilters = {
        ...filters,
        q: value,
      };
    } else if (name === "categories") {
      updatedFilters = {
        ...filters,
        categories: checked
          ? [...filters.categories, value]
          : filters.categories.filter((id) => id !== value),
      };
    } else if (name === "minPrice") {
      updatedFilters = {
        ...filters,
        minPrice: value,
      };
    } else if (name === "maxPrice") {
      updatedFilters = {
        ...filters,
        maxPrice: value,
      };
    }
    setFilters(updatedFilters);
    setSearchParams(updatedFilters);
  };

  const searchUrlFilter = () => {
    const updatedFilters = {
      ...filters,
      q: searchParams.get("q") || "",
      categories: searchParams.getAll("categories") || [],
    };
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice !== null) {
      updatedFilters.minPrice = minPrice;
    }
    if (maxPrice !== null) {
      updatedFilters.maxPrice = maxPrice;
    }
    setFilters(updatedFilters);
  };

  useEffect(() => {
    searchUrlFilter();
    // eslint-disable-next-line
  }, [searchParams]);
  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      getProducts(0);
    }, 2000);
    return () => {
      setIsLoading(false);
      clearTimeout(timer);
    };

    // eslint-disable-next-line
  }, [filters, sortValue, directionValue]);

  const checkProductAvailability = () => {
    const hasProducts = products.length > 0;
    setShowMessage(!hasProducts);
  };
  useEffect(() => {
    checkProductAvailability();
    // eslint-disable-next-line
  }, [products]);
  return loading ? (
    <Loading />
  ) : (
    <Container fluid className="shop p-6">
      <Row className="shop-row  mb-3">
        <Col xl={2} lg={3} md={4}>
          <CheckFilter
            categoryIdData={categoryIdData}
            handleFiltersChange={handleFiltersChange}
            filters={filters}
          />
        </Col>

        <Col xl={10} lg={9} md={8}>
          <SearchFilter
            setactivepage={setactivepage}
            activepage={activepage}
            products={products}
            setProducts={setProducts}
            setSortValue={setSortValue}
            setDirectionValue={setDirectionValue}
            handleFiltersChange={handleFiltersChange}
            filters={filters}
          />
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {showMessage ? (
                <p className="showMessage">
                  İstediğiniz özelliklerde ürün bulunmamaktadır.
                </p>
              ) : activepage ? (
                <ShopProducts products={products} filters={filters} />
              ) : (
                <ShopProductsLayout products={products} filters={filters} />
              )}
            </>
          )}
        </Col>
      </Row>
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
            {[...Array(paging.totalPages)].map((_, index) => (
              <Fragment key={index}>
                {index === paging.pageNumber && (
                  <Pagination.Item active>{index + 1}</Pagination.Item>
                )}
                {index !== paging.pageNumber &&
                  index >= Math.max(0, paging.pageNumber - 1) &&
                  index <=
                    Math.min(paging.totalPages - 1, paging.pageNumber + 1) && (
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
    </Container>
  );
};
export default Shop;
