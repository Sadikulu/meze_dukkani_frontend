import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import "./check-filter.scss";

const CheckFilter = ({ categoryIdData, handleFiltersChange, filters }) => {
  return (
    <section className="check-filter">
      <Row>
        <Col xs={6} sm={4} md={12}>
          <div className="categories-filter mb-4">
            <Card>
              <Card.Title>Kategoriler</Card.Title>
              <Form>
                {categoryIdData.map((category) => (
                  <Form.Group className="mb-1" key={category.id}>
                    <Form.Check
                      type="checkbox"
                      name="categories"
                      label={category.title}
                      value={category.id}
                      checked={filters.categories.includes(
                        category.id.toString()
                      )}
                      onChange={handleFiltersChange}
                    />
                  </Form.Group>
                ))}
              </Form>
            </Card>
          </div>
        </Col>

        <Col xs={12} sm={4} md={12}>
          <div className="price-filter mb-4">
            <Card>
              <Card.Title>Fiyat</Card.Title>
              <Form>
                <Form.Group>
                  <Form.Label>Minimum</Form.Label>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFiltersChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Maximum</Form.Label>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFiltersChange}
                  />
                </Form.Group>
              </Form>
            </Card>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default CheckFilter;
