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
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/invoices" },
  { text: "Invoices", icon: <ReceiptLong />, path: "/invoices/editor" },
  { text: "Items", icon: <Inventory />, path: "/items" },
];

export const Sidebar = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));


  /* ---------------- DRAWER CONTENT ---------------- */
  const drawerContent = (
    <>
      {/* Collapse Toggle (Desktop only) */}
      {!isMobile && (
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton onClick={onToggleCollapse} sx={{ color: "#fff" }}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>
      )}

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
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) onMobileClose();
                }}
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
    </>
  );

  /* ---------------- MOBILE ---------------- */
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{keepMounted: true}}
        sx={{
          "& .MuiDrawer-paper": {
            width: EXPANDED_WIDTH,
            backgroundColor: "#1f2937",
            color: "#fff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  /* ---------------- DESKTOP ---------------- */
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH,
          transition: "width 0.25s ease",
          overflowX: "hidden",
          backgroundColor: "#1f2937",
          color: "#fff",
          borderRight: "none",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
