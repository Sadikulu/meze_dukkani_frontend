import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Unauthorized from "../../components/common/unauthorized/unauthorized";
import AnonymousTemplate from "../../templates/anonymous-template";
import Spacer from "../../components/common/spacer/spacer";

const UnauthorizedPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader />
      <Spacer/>
      <Unauthorized />
      <Spacer/>
    </AnonymousTemplate>
  );
};

export default UnauthorizedPage;
