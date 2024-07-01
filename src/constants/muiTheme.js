import { createTheme } from "@mui/material";

export const muiTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#ff4081",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#ff79b0",
          },
          padding: "10px 20px",
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
  },
});
