import { Box, Typography, ButtonGroup, Button } from "@mui/material";


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
    </Box>
  );
};
