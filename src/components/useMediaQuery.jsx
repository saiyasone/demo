import { Fragment } from "react";
import { useMediaQuery, Typography, createTheme } from "@mui/material";

export function AppMediaQuery() {
  //   const theme = createTheme();
  //   const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const matches = useMediaQuery("@media(max-width: 600px)");
  return (
    <Fragment>
      <Typography variant="h3">
        {matches
          ? "Hello Media Query Mobile"
          : "Hello Media Query Tablet of PC"}
      </Typography>
    </Fragment>
  );
}
