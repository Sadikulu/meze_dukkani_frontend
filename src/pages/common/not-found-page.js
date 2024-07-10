import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import NotFound from "../../components/common/not-found/not-found";
import AnonymousTemplate from "../../templates/anonymous-template";
import Spacer from "../../components/common/spacer/spacer";

const NotFoundPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader />
      <Spacer/>
      <NotFound />
      <Spacer/>
    </AnonymousTemplate>
  );
};

export default NotFoundPage;
