import React from "react";
import Footer from "../components/anonymous/common/footer/footer";
import Header from "../components/anonymous/common/header/header";


const UserTemplate = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default UserTemplate;
