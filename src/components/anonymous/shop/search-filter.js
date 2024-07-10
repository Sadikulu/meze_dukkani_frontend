import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { TbLayoutGrid } from "react-icons/tb";
import "./search-filter.scss";
import { handleClickPriceInc } from "../../../helpers/functions/sorty-by";
const SearchFilter = ({
  setactivepage,
  activepage,
  products,
  setProducts,
  setSortValue,
  setDirectionValue,
  handleFiltersChange,
  filters,
}) => {
  // useEffect(() => {
  //   const filteredProducts = products.filter((product) =>
  //     product.title.toLowerCase().includes(searchInputValue.toLowerCase())
  //   );
  //   setProducts(filteredProducts);
  // }, [searchInputValue]);

  return (
    <div className="search-filter">
      <div className="input-group">
        <InputGroup className="input-group mb-3">
          <Form.Control
            placeholder="Ara..."
            type="search"
            name="q"
            value={filters.q}
            onChange={handleFiltersChange}
          />
          <Button className="btn-svg" type="button">
            <FiSearch />
          </Button>
        </InputGroup>
      </div>

      <div className="form-tblayout">
        <Form.Select
          name="sort"
          onChange={(e) =>
            handleClickPriceInc(e.target.value, setSortValue, setDirectionValue)
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
        <div className="tblayout">
          <TbLayoutGrid
            onClick={() => {
              setactivepage(!activepage);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
