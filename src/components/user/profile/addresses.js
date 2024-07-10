import React, { useState, useEffect } from "react";
import { toast } from "../../../helpers/functions/swal";
import Loading from "../../common/loading/loading";
import NewAddressForm from "./new-address-form";
import AddressList from "./address-list";
import { getUserAddresses } from "../../../api/address-service";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "./sidebar";
import "./addresses.scss";

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await getUserAddresses();
      setAddresses(resp.data);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = (newAddress) => {
    setAddresses([...addresses, newAddress]);
  };

  const handleUpdateAddress = (updatedAddress) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === updatedAddress.id ? updatedAddress : address
    );
    setAddresses(updatedAddresses);
  };

  const handleDeleteAddress = (deletedAddress) => {
    const filteredAddresses = addresses.filter(
      (address) => address.id !== deletedAddress.id
    );
    setAddresses(filteredAddresses);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="addresses">
      <Row className="addresses-row">
        <Col md={4}>
          <Sidebar />
        </Col>

        <Col md={8}>
          {loading ? (
            <Loading />
          ) : (
            <>
              <NewAddressForm
                onAddAddress={handleAddAddress}
                loadData={loadData}
              />

              <AddressList
                addresses={addresses}
                onDeleteAddress={handleDeleteAddress}
                onUpdateAddress={handleUpdateAddress}
              />
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Addresses;