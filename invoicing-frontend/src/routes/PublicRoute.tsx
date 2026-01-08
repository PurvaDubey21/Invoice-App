import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../services/auth.rtk";

export const PublicRoute = () => {
  const { data, isLoading } = useGetMeQuery();

  if (isLoading) return null;

  if (data) {
    return <Navigate to="/invoices" replace />; // NOT /invoice
  }

  return <Outlet />;
};
