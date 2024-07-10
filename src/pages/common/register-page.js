import React from "react";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import RegisterForm from "../../components/common/auth/register-form";
import AnonymousTemplate from "../../templates/anonymous-template";
const RegisterPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader title="Kayıt Ol" />
      <Spacer />
      <RegisterForm />
      <Spacer />
    </AnonymousTemplate>
  );
};
export default RegisterPage;
