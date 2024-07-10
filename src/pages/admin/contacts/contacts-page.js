import React from "react";
import ContactMessages from "../../../components/admin/contacts/contacts-messages";
import AdminTemplate from "../../../templates/admin-template";

const ContactsPage = () => {
  return (
    <AdminTemplate>
      <ContactMessages />
    </AdminTemplate>
  );
};

export default ContactsPage;
