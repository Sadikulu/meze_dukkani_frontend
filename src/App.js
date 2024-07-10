import React, { useEffect, useState } from "react";
import { getUser } from "./api/user-service";
import {
  encryptedLocalStorage,
  encryptedSessionStorage,
} from "./helpers/functions/encrypt-storage";
import { settings } from "./helpers/setting";
import LoadingPage from "./pages/common/loading-page";
import CustomRoutes from "./router/custom-routes";
import { useAppDispatch } from "./store/hooks";
import { loginFailed, loginSuccess } from "./store/slices/auth-slice";
import { loadCart } from "./helpers/functions/cart-header";
import { setItems } from "./store/slices/favorite-slice";
import { toast } from "./helpers/functions/swal";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token =
          encryptedLocalStorage.getItem("token") ||
          encryptedSessionStorage.getItem("token");
        if (token) {
          const resp = await getUser();
          console.log("Kullanici yaniti:", resp); // Yanıtı debug için logluyoruz
          if (resp && resp.data) {
            dispatch(loginSuccess(resp.data));
            dispatch(setItems(resp.data.favoriteList));
          } else {
            throw new Error("Yanit verisi tanimli değil veya hatali");
          }
        }
      } catch (err) {
        console.error("Kullanici yüklenirken hata oluştu:", err);
        toast(err.response?.data?.message || "Bir hata oluştu", "error");
        dispatch(loginFailed());
      }
    };

    const loadData = async () => {
      await loadUser();
      await loadCart();
      setLoading(false);
    };

    document.title = `${settings.siteName} | Mezeciniz`;
    loadData();
  }, [dispatch]);

  return (
    <div style={{ backgroundColor: "rgb(237, 237, 237)" }}>
      {loading ? <LoadingPage /> : <CustomRoutes />}
    </div>
  );
};

export default App;
