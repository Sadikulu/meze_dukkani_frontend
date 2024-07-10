import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import Addresses from "../../components/user/profile/addresses";
import UserTemplate from "../../templates/user-template";

const AddressesPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Adresler" />
      <Spacer />
      <Addresses />
      <Spacer />
    </UserTemplate>
  );
};

export default AddressesPage;
