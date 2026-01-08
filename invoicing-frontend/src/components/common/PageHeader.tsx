import { Box, Typography, ButtonGroup, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../services/auth.rtk";
import { baseApi } from "../../api/baseQuery";


const filters = ["Today", "Week", "Month", "Year", "Custom"];
export const PageHeader = ({
  title,
  value,
  onChange,
}: {
  title: string;
  value: string;
  onChange: (val: string) => void; // ✅ FIXED
}) => {

  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      // 🔥 clear all RTK Query cache (auth + invoice + items)
      baseApi.util.resetApiState();

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={6}
      py={2}
    >
      
     
      {/* LEFT: TITLE */}
      <Typography fontSize={24} fontWeight={600} color="#535255">
        {title}
      </Typography>

      {/* RIGHT: FILTER BUTTONS */}
     <Box display="flex" alignItems="center">
      <ButtonGroup
        variant="outlined"
        sx={{
          "& .MuiButton-root": {
            borderRadius: "999px", // 🔥 pill shape
            textTransform: "none",
            fontSize: 12,
            padding: "4px 14px",
            borderColor: "#d1d2d4",
            ml:2
            
            
            
          },
        }}
      >
        {filters.map((f) => (
          <Button
            key={f}
            onClick={() => onChange(f.toLowerCase())}
            sx={{
              backgroundColor:
                value === f.toLowerCase() ? "#525355" : "transparent",
              color:
                value === f.toLowerCase() ? "#fff" : "#525355",
              "&:hover": {
                backgroundColor:
                  value === f.toLowerCase()
                    ? "#424244"
                    : "#f0f1f2",
              },
            }}
          >
            {f}
          </Button>
        ))}
      </ButtonGroup>
      {/* 🔐 LOGOUT BUTTON (UI CONSISTENT) */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleLogout}
          disabled={isLoading}
          sx={{
            borderRadius: "999px",
            textTransform: "none",
            fontSize: 12,
            padding: "4px 14px",
            ml: 2,
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};
