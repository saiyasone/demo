import { Card } from "@mui/material";

function AppCard(props) {
  const { children } = props;
  return <Card>{children}</Card>;
}

export default AppCard;
