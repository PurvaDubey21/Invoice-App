import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  components: {
    /* ----------------------------------
       OUTLINED TEXTFIELD (Global)
    ---------------------------------- */
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          // Default border
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#c4c4c4",
          },

          // Hover border
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#525355",
          },

          // Focus border (BLUE ❌ → #525355 ✅)
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#525355",
            borderWidth: "1px soloid #525355",
          },
        },
      },
    },

    /* ----------------------------------
       INPUT LABEL (Outlined + Others)
    ---------------------------------- */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // Focus label color
          "&.Mui-focused": {
            color: "#525355",
          },
        },
      },
    },
  },
});
