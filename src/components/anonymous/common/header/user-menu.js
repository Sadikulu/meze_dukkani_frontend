import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { logout } from "../../../../store/slices/auth-slice";
import { question } from "../../../../helpers/functions/swal";
import { RxPerson } from "react-icons/rx";
import {
  encryptedLocalStorage,
  encryptedSessionStorage,
} from "../../../../helpers/functions/encrypt-storage";
import "./user-menu.scss";
import { setCart } from "../../../../store/slices/cart-slice";

const UserMenu = () => {
  const { isUserLogin, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    question("Çıkış", "Çıkış yapmak istediğinize emin misiniz?").then(
      (result) => {
        if (result.isConfirmed) {
          dispatch(logout());
          dispatch(setCart([]));
          encryptedLocalStorage.removeItem("token");
          encryptedSessionStorage.removeItem("token");
          localStorage.removeItem("cartUUID");
          sessionStorage.removeItem("cartUUID");
          navigate("/");
          window.location.reload();
        }
      }
    );
  };

  return (
    <div className="user-menu">
      {isUserLogin ? (
        <Dropdown align="end">
          <Dropdown.Toggle className="dropdown-user" variant="primary">
            {user.firstName} {user.lastName}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {user.roles.includes("Administrator") ? (
              <>
                <Dropdown.Item as={Link} to="/admin">
                  Yönetici Paneli
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            ) : user.roles.includes("Manager") ? (
              <>
                <Dropdown.Item as={Link} to="/admin">
                  Müdür Paneli
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            ) : (
              <>
                <Dropdown.Item as={Link} to="/user">
                  Kullanıcı Paneli
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            )}

            <Dropdown.Item as={Link} to="/user">
              Profil
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/user/account">
              Hesap
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/user/addresses">
              Adresler
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/user/favorites">
              Favori Ürünler
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/user/orders">
              Siparişler
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Çıkış</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button
          className="btn btn-account "
          onClick={() => !isUserLogin && navigate("/login")}
        >
          <RxPerson /> Giriş Yap
        </Button>
      )}
    </div>
  );
};

export default UserMenu;
