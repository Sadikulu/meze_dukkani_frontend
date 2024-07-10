import React, { useState } from "react";
import Spacer from "../../common/spacer/spacer";
import AdminUserEdit1 from "./admin-user-edit-1";
import AdminUserEditOrders from "./admin-user-edit-orders";
import AdminUserEditReviews from "./admin-user-edit-reviews";
import { Container, Tab, Tabs } from "react-bootstrap";
import AdminUserEditAddresses from "./admin-user-edit-addresses";
import "./admin-user-edit-2.scss";

const AdminUserEdit = () => {
  const [key, setKey] = useState("orders");
  return (
    <div>
      <AdminUserEdit1 />
      <Spacer />
      <Container className="admin-user-edit-2">
        <div className="admin-user-edit-2-div">
          <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
            <Tab eventKey="orders" title="Siparişler" className="orders-tab">
              <AdminUserEditOrders />
            </Tab>
            <Tab eventKey="reviews" title="Yorumlar" className="reviews-tab">
              <AdminUserEditReviews />
            </Tab>
            <Tab
              eventKey="addresses"
              title="Adresler"
              className="addresses-tab"
            >
              <AdminUserEditAddresses />
            </Tab>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default AdminUserEdit;
