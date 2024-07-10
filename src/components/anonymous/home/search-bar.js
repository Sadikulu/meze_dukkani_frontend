import React, { useState, useEffect } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import "./search-bar.scss";
import { useNavigate } from "react-router-dom";
import Slider from "./slider";
import { getProductsByPage } from "../../../api/product-service";
import { toast } from "../../../helpers/functions/swal";
import { getCategoriesByPage } from "../../../api/category-service";

const SearchBar = () => {
  // eslint-disable-next-line
  const [products, setProducts] = useState([]);
  const [categoryIdData, setCategoryIdData] = useState([]);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ q: "", categories: [] });
  const navigate = useNavigate();

  const loadData = async () => {
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
    try {
      if (filters.q.length < 3) {
        setProducts([]);
        return;
      }
      const resp = await getProductsByPage({
        q: encodeURI(filters.q),
        categories: filters.categories,
        page: 0,
      });
      setProducts(resp.data.content);
    } catch (err) {
      const message = err.response ? err.response.data.message : err;
      toast(message, "error");
    }
  };

  useEffect(() => {
    loadData(0);
  }, []);

  useEffect(() => {
    getProducts(0);
    // eslint-disable-next-line
  }, [filters]);

  const handleFiltersChange = (e) => {
    const name = e.target.name;
    const value = name === "q" ? e.target.value : [e.target.value];
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    if (name === "q" && value.length < 3 && value.length > 70) {
      return;
    }
    if (name === "categories" && value[0] === "all") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        categories: [],
      }));
    }
  };

  const handleSearchClick = () => {
    let url = "/shop";
    const qUrl = filters.q ? `q=${filters.q}` : "";
    const categoriesUrl = filters.categories.length
      ? `categories=${filters.categories.join(",")}`
      : "";
    if (qUrl || categoriesUrl) {
      url += `?${qUrl}${categoriesUrl && `&${categoriesUrl}`}`;
    }
    navigate(url);
  };

  return (
    <div className="searchbar">
      <Slider />
      <div className="content">
        <h2>Sizin Mezeciniz</h2>
        <InputGroup className="input-group mb-3">
          <Form.Control
            type="search"
            placeholder="Ara..."
            name="q"
            value={filters.q}
            onChange={handleFiltersChange}
          />
          <Form.Select
            name="categories"
            value={filters.categories[0]}
            onChange={handleFiltersChange}
          >
            <option value="all">Tüm Kategoriler</option>
            {categoryIdData.map((category) => {
              return (
                <option className="py-2" value={category.id} key={category.id}>
                  {category.title}
                </option>
              );
            })}
          </Form.Select>

          <Button
            disabled={filters.q.length < 3 && filters.categories.length === 0}
            className="btn-svg"
            type="button"
            onClick={handleSearchClick}
          >
            <FiSearch />
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default SearchBar;
