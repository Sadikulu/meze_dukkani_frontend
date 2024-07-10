import React from "react";
import Favorites from "../../components/user/profile/favorites";
import PageHeader from "../../components/anonymous/page-header/page-header";
import Spacer from "../../components/common/spacer/spacer";
import UserTemplate from "../../templates/user-template";

const FavoritesPage = () => {
  return (
    <UserTemplate>
      <PageHeader title="Favori Ürünler" />
      <Spacer />
      <Favorites />
      <Spacer />
    </UserTemplate>
  );
};

export default FavoritesPage;
