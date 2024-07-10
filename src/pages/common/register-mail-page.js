import React from 'react'
import AnonymousTemplate from '../../templates/anonymous-template'
import PageHeader from '../../components/anonymous/page-header/page-header'
import Spacer from '../../components/common/spacer/spacer'
import RegisterMail from '../../components/common/auth/register-mail'

const RegisterMailPage = () => {
  return (
    <AnonymousTemplate>
    <PageHeader />
    <Spacer />
    <RegisterMail />
    <Spacer />
  </AnonymousTemplate>
  )
}

export default RegisterMailPage