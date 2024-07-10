import React from "react";
import Footer from "../components/anonymous/common/footer/footer";
import Header from "../components/anonymous/common/header/header";

const AnonymousTemplate = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default AnonymousTemplate;
