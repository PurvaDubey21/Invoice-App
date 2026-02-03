import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  ReceiptLong,
  Inventory,
  
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";


const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/invoices" },
  { text: "Invoices", icon: <ReceiptLong />, path: "/invoices/editor" },
  { text: "Items", icon: <Inventory />, path: "/items" },
];

export const Sidebar = ({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) => {
 
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          backgroundColor: "#1f2937", // ChatGPT dark
          color: "#fff",
          position: "fixed",
          borderRight: "none",
        },
      }}
    >
      {/* 🔹 Toggle Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          p: 1,
        }}
      >
        <IconButton onClick={onToggle} sx={{ color: "#fff" }}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* 🔹 Menu */}
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Tooltip
              key={item.text}
              title={collapsed ? item.text : ""}
              placement="right"
            >
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  my: 0.5,
                  borderRadius: 1,
                  justifyContent: collapsed ? "center" : "flex-start",
                  backgroundColor: isActive ? "#374151" : "transparent",
                  "&:hover": {
                    backgroundColor: "#374151",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: "#fff",
                    minWidth: collapsed ? "auto" : 36,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Drawer>
  );
};
