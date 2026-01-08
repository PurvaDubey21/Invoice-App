import { AppBar, Toolbar, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
export const Header = () => {
  return (
    <AppBar position="sticky"  elevation={0} color="transparent" sx={{ bgcolor: "white" }}>
      <Toolbar className="justify-center gap-1 flex">
        <ReceiptLongIcon sx={{ color: "#525355" }} />
        <Typography variant="h6" fontWeight={600} sx={{ color: "#525355" }}>
          InvoiceApp
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
