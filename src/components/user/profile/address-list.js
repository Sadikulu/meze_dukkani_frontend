import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { deleteAddress, updateAddress } from "../../../api/address-service";
import { question, toast } from "../../../helpers/functions/swal";
import EditAddressForm from "./edit-address-form";
import { HiOutlinePencil } from "react-icons/hi";
import { BiTrash } from "react-icons/bi";
import "./address-list.scss";

const AddressList = ({ addresses, onDeleteAddress, onUpdateAddress }) => {
  const [editingAddress, setEditingAddress] = useState(null);
  // eslint-disable-next-line
  const [updating, setUpdating] = useState(false);
  // eslint-disable-next-line
  const [deleting, setDeleting] = useState(false);

  const handleEditAddress = (userAddress) => {
    setEditingAddress(userAddress);
  };

  const handleCancelEdit = () => {
    setEditingAddress(null);
  };

  const handleUpdateAddress = async (updatedAddress) => {
    setUpdating(true);
    try {
      await updateAddress(updatedAddress.id, updatedAddress);
      onUpdateAddress(updatedAddress);
      setEditingAddress(null);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const removeAddress = async (userAddress) => {
    setDeleting(true);
    try {
      await deleteAddress(userAddress.id);
      toast("Address was deleted", "success");
      onDeleteAddress(userAddress);
    } catch (err) {
      toast(err.response.data.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteAddress = (userAddress) => {
    question("Are you sure to delete?", "You won't be able to undo it!").then(
      (result) => {
        if (result.isConfirmed) {
          removeAddress(userAddress);
        }
      }
    );
  };

  return (
    <section className="address-list">
      {addresses.map((userAddress, index) => (
        <Card className="mt-4 p-4" key={index}>
          {editingAddress === userAddress ? (
            <EditAddressForm
              userAddress={userAddress}
              onCancelEdit={handleCancelEdit}
              onUpdateAddress={handleUpdateAddress}
            />
          ) : (
            <Row>
              <Col xs={10}>
                <Card.Title>{userAddress.title}</Card.Title>
                <Card.Text>
                  <span>{userAddress.address},</span>
                  <span>{userAddress.province},</span>
                  <span>{userAddress.city},</span>
                  <span>{userAddress.country}</span>
                </Card.Text>
              </Col>
              <Col xs={2}>
                <span onClick={() => handleDeleteAddress(userAddress)}>
                  <BiTrash />
                </span>
                <span onClick={() => handleEditAddress(userAddress)}>
                  <HiOutlinePencil />
                </span>
              </Col>
            </Row>
          )}
        </Card>
      ))}
    </section>
  );
};

export default AddressList;
