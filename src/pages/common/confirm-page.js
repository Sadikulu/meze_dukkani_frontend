import React from 'react'
import AnonymousTemplate from '../../templates/anonymous-template'
import PageHeader from '../../components/anonymous/page-header/page-header'
import Spacer from '../../components/common/spacer/spacer'
import Confirm from '../../components/common/auth/confirm'

const ConfirmPage = () => {
  return (
    <AnonymousTemplate>
      <PageHeader />
      <Spacer />
      <Confirm />
      <Spacer />
    </AnonymousTemplate>
  )
}

export default ConfirmPage