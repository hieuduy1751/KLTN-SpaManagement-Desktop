import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Logout: React.FC = () => {
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  return <Navigate to="/auth/login" replace />;
};

export default Logout;