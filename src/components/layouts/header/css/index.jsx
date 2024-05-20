import { Box, Container, createTheme, styled } from "@mui/material";
const theme = createTheme();

export const HeaderContainer = styled(Container)({});

export const HeaderNav = styled(Box)({
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

        "&:focus": {
          color: "#000",
        },
        "&.active": {
          color: "#d33",
        },
      },
    },
  },
});
