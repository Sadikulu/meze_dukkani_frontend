import React from "react";
import Contact from "../../components/anonymous/contact/contact";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";

const ContactPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="İletişim" />
      <Spacer height={125} />
      <Contact />
    </AnonymousTemplate>
  );
};

export default ContactPage;
