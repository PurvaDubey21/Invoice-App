import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import { Sidebar } from "./Sidebar";


export const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden", // ✅ lock body scroll
      }}
    >
    
      
      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* MAIN AREA */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflow: "auto", // ✅ only this scrolls
          height: "100vh",
          backgroundColor: "#f5f6f7",
          transition: "margin-left 0.25s ease",
        }}
      >
        <Outlet context={{ openSidebar: () => setMobileOpen(true)}}/>
      </Box>
    </Box>
  );
};
