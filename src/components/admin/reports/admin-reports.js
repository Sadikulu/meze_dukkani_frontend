import React from "react";
import { useState } from "react";
import fileDownload from "js-file-download";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { AiOutlinePrinter } from "react-icons/ai";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "../../../helpers/functions/swal";
import "./admin-reports.scss";
import {
  getMostPopulars,
  getReportOrders,
  getUnorderedProducts,
} from "../../../api/report-service";
import {
  checkDates,
  getCurrentDate,
} from "../../../helpers/functions/date-time";
import AdminPageTitle from "../common/admin-page-title";

const AdminReports = () => {
  const [downloadingOrders, setDownloadingOrders] = useState(false);
  const [downloadingMost, setDownloadingMost] = useState(false);
  const [downloadingUnOrdered, setDownloadingUnOrdered] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountTouched, setAmountTouched] = useState(false);

  const initialValues = {
    date1: "",
    date2: "",
    type: "",
  };

  const validationSchema = Yup.object({
    date1: Yup.string()
      .required("Select a begining date")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
    date2: Yup.string()
      .required("Select a ending date")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
      .test(
        "date2-greater-than-date1",
        "End date should be greater than start date ",
        (val, { parent }) => checkDates(parent, val)
      ),
    type: Yup.string().required("Select a type"),
  });

  const onSubmit = async (values) => {
    setDownloadingOrders(true);
    try {
      const { date1, date2, type } = values;
      const resp = await getReportOrders(date1, date2, type);
      fileDownload(resp.data, `orders.xlsx`);
      toast("İndirme Başarılı", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDownloadingOrders(false);
    }
  };
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const handleBlur = () => {
    setAmountTouched(true);
  };

  const handleDownloadMostPopular = async () => {
    setDownloadingMost(true);
    try {
      const resp = await getMostPopulars(amount);
      fileDownload(resp.data, `mostPopular.xlsx`);
      toast("İndirme Başarılı", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDownloadingMost(false);
    }
  };

  const handleDownloadUnOrderedProduct = async () => {
    setDownloadingUnOrdered(true);
    try {
      const resp = await getUnorderedProducts();
      fileDownload(resp.data, `unOrderedProduct.xlsx`);
      toast("İndirme Başarılı", "success");
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDownloadingUnOrdered(false);
    }
  };

  return (
    <Container className="admin-reports">
      <AdminPageTitle />
      <Form noValidate onSubmit={formik.handleSubmit} className="orders-report">
        <Row className="my-5">
          <Col md={10} className="report-col">
            <h5>Orders</h5>
            <Row className="orders-select">
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Başlangıç Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    max={getCurrentDate()}
                    {...formik.getFieldProps("date1")}
                    isInvalid={formik.touched.date1 && formik.errors.date1}
                    isValid={formik.touched.date1 && !formik.errors.date1}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.date1}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Bitiş Tarihi</Form.Label>
                  <Form.Control
                    type="date"
                    min={formik.values.date1}
                    max={getCurrentDate()}
                    {...formik.getFieldProps("date2")}
                    isInvalid={formik.touched.date2 && formik.errors.date2}
                    isValid={formik.touched.date2 && !formik.errors.date2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.date2}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tip</Form.Label>
                  <Form.Select
                    {...formik.getFieldProps("type")}
                    isValid={formik.touched.type && !formik.errors.type}
                    isInvalid={formik.touched.type && !!formik.errors.type}
                  >
                    <option>Seciniz</option>
                    <option value="day">Gün</option>
                    <option value="week">Hafta</option>
                    <option value="month">Ay</option>
                    <option value="year">Yıl</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.type}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col md={2} className="btn-report">
            <Button type="submit" disabled={downloadingOrders}>
              <AiOutlinePrinter />
            </Button>
          </Col>
        </Row>
      </Form>
      <Form noValidate className="most-popular-products-report">
        <Row className="my-5">
          <Col md={10} className="report-col">
            <h5>Popüler Ürünler</h5>
            <Row className="most-popular-products-input">
              <Col md={4}>
                <Form.Group>
                  <Form.Control
                    required
                    isInvalid={amountTouched && !amount}
                    isValid={amount}
                    type="text"
                    name="name"
                    value={amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Bir şeyler yazınız?"
                  />
                  {amountTouched && !amount && (
                    <Form.Control.Feedback type="invalid">
                      Ürün Numarası Giriniz
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Col>
          <Col md={2} className="btn-report">
            <Button
              type="submit"
              disabled={downloadingMost}
              onClick={handleDownloadMostPopular}
            >
              <AiOutlinePrinter />
            </Button>
          </Col>
        </Row>
      </Form>

      <Form noValidate className="unordered-products-report">
        <Row className="my-5">
          <Col md={10} className="report-col">
            <h5>Satılamayan Ürünler</h5>
          </Col>
          <Col md={2} className="btn-report">
            <Button
              type="submit"
              disabled={downloadingUnOrdered}
              onClick={handleDownloadUnOrderedProduct}
            >
              <AiOutlinePrinter />
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AdminReports;
