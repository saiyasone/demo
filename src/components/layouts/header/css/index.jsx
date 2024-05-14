import { Box, Container, styled } from "@mui/material";

export const HeaderContainer = styled(Container)({});

export const HeaderNav = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1rem 0",

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
