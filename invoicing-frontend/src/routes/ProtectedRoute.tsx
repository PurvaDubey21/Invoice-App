import { Navigate, Outlet } from "react-router-dom";
// import { Box, CircularProgress } from "@mui/material";
import {jwtDecode} from "jwt-decode";

type JwtPayload = {
  userId: number;
  companyID: number;
  exp: number;
}

const isValidToken = (token: string) => {
  try{
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 > Date.now();
  }catch{
    return false;
  }
}


export const ProtectedRoute = () => {
  const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

  
  if (!token || !isValidToken(token)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
