import { Box, Container, createTheme, styled } from "@mui/material";
const theme = createTheme();

export const HeaderContainer = styled(Container)({
  width: "100%",
  position: "fixed",
  top: 0,
  zIndex: 999,
  transition: "all 250ms ease",
});

export const HeaderNav = styled(Box)(({ isToggle }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 0",

  [theme.breakpoints.down(763)]: {
    display: "none",
  },

  img: {
    width: "40px",
    objectFit: "cover",
  },

  ul: {
    listStyle: "none",
    li: {
      display: "flex",
      gap: "2rem",

      a: {
        textDecoration: "none",
        color: isToggle ? "#fff" : "#000",

        "&:focus": {
          color: "#000",
        },
        "&.active": {
          color: "#d33",
        },
      },
    },
  },
}));
