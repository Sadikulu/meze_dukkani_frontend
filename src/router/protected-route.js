import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

const ProtectedRoute = ({ children, admin }) => {
  const { isUserLogin, user } = useAppSelector((state) => state.auth);

  if (!isUserLogin) return <Navigate to="/login" />;

  if (
    admin &&
    !(user.roles.includes("Administrator") || user.roles.includes("Manager"))
  )
    return <Navigate to="/Unauthorized" />;

  return children;
};

export default ProtectedRoute;
