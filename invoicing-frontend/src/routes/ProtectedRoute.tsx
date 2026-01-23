import { Navigate, Outlet } from "react-router-dom";
// import { Box, CircularProgress } from "@mui/material";


export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
