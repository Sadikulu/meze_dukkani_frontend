import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminCategoriesPage from "../pages/admin/categories/categories-page";
import AdminCategoryEditPage from "../pages/admin/categories/category-edit-page";
import AdminCategoryNewPage from "../pages/admin/categories/category-new-page";
import AdminDashboardPage from "../pages/admin/dashboard/admin-dashboard";
import AdminOrderDetailsPage from "../pages/admin/orders/order-details-page";
import AdminOrdersPage from "../pages/admin/orders/orders-page";
import AdminProductEditPage from "../pages/admin/products/admin-product-edit-page";
import AdminProductNewPage from "../pages/admin/products/admin-product-new-page";
import AdminProductsPage from "../pages/admin/products/products-page";
import AdminReportsPage from "../pages/admin/reports/admin-reports-page";
import AdminReviewsPage from "../pages/admin/reviews/admin-reviews-page";
import AdminUserEditPage from "../pages/admin/users/user-edit-page";
import AdminUsersPage from "../pages/admin/users/admin-users-page";
import CartPage from "../pages/anonymous/cart-page";
import ContactPage from "../pages/anonymous/contact-page";
import HomePage from "../pages/anonymous/home-page";
import PrivacyPolicyPage from "../pages/anonymous/privacy-policy-page";
import ProductDetailsPage from "../pages/anonymous/product-details-page";
import ShopPage from "../pages/anonymous/shop-page";
import ForgotPasswordPage from "../pages/common/forgot-password-page";
import LoginPage from "../pages/common/login-page";
import NotFoundPage from "../pages/common/not-found-page";
import RegisterPage from "../pages/common/register-page";
import ResetPasswordPage from "../pages/common/reset-password-page";
import UnauthorizedPage from "../pages/common/unauthorized-page";
import AccountPage from "../pages/user/account-page";
import AddressesPage from "../pages/user/addresses-page";
import CheckoutPage from "../pages/user/checkout-page";
import FavoritesPage from "../pages/user/favorites-page";
import OrderDetailsPage from "../pages/user/order-details-page";
import OrdersPage from "../pages/user/orders-page";
import ProfilePage from "../pages/user/profile-page";
import ScrollToTop from "../components/common/scroll-to-top/scroll-to-top";
import ContactsPage from "../pages/admin/contacts/contacts-page";
import ContactMessageEditPage from "../pages/admin/contacts/contact-message-edit-page";
import ProtectedRoute from "./protected-route";
import ForgotResetPage from "../pages/common/forgot-reset-page";
import ConfirmPage from "../pages/common/confirm-page";
import RegisterMailPage from "../pages/common/register-mail-page";

const CustomRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/">
          {/* Anonymous and Common pages routes */}
          <Route index element={<HomePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="register-mail" element={<RegisterMailPage />} />
          <Route path="confirm" element={<ConfirmPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="forgot-reset" element={<ForgotResetPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="shop">
            <Route index element={<ShopPage />} />
            <Route path=":shopId" element={<ProductDetailsPage />} />
          </Route>

          {/* User pages routes */}
          <Route path="user">
            <Route
              index
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="addresses"
              element={
                <ProtectedRoute>
                  <AddressesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            />
            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin pages routes */}
          <Route path="admin">
            <Route
              index
              element={
                <ProtectedRoute admin={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="products">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <AdminProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":productId"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminProductEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new-product"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminProductNewPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="categories">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <AdminCategoriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":categoryId"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminCategoryEditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="new-category"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminCategoryNewPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="orders">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <AdminOrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":orderId"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminOrderDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="reviews">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <AdminReviewsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="contact-messages">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <ContactsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":messageId"
                element={
                  <ProtectedRoute admin={true}>
                    <ContactMessageEditPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path="users">
              <Route
                index
                element={
                  <ProtectedRoute admin={true}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":userId"
                element={
                  <ProtectedRoute admin={true}>
                    <AdminUserEditPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route
              path="reports"
              element={
                <ProtectedRoute admin={true}>
                  <AdminReportsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default CustomRoutes;
