import { Routes, Route, Navigate } from "react-router-dom";

import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import { InvoicePage } from "./features/invoices/InvoicePage";
import { ItemListPage } from "./pages/items/ItemListPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PublicRoute } from "./routes/PublicRoute";

function App() {
  return (
    <Routes>
      {/* DEFAULT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* PUBLIC ROUTES (only when NOT logged in) */}
      <Route element={<PublicRoute />}>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* PROTECTED ROUTES (login required) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/invoices" element={<InvoicePage />} />
         <Route path="/items" element={<ItemListPage />} /> 

        {/* future */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
