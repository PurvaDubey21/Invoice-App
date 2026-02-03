import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar 
      collapsed={collapsed} 
      onToggle={() => setCollapsed(!collapsed)} 
      />

      <Box
  component="main"
  sx={{
    flexGrow: 1,
    backgroundColor: "#f5f6f7",        // ✅ moved here
    transition: "margin-left 0.25s ease",
  }}
>
        <Outlet />
      </Box>
    </Box>
  );
};
