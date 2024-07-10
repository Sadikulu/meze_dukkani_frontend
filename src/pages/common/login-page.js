import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import LoginForm from "../../components/common/auth/login-form";
import Spacer from "../../components/common/spacer/spacer";
import AnonymousTemplate from "../../templates/anonymous-template";

const LoginPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Giriş Yap" />
      <Spacer />
      <LoginForm />
      <Spacer />
    </AnonymousTemplate>
  );
};

export default LoginPage;
