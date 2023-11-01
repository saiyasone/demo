import { Button, Box, styled, createTheme } from "@mui/material";
import { FaUpload } from "react-icons/fa6";
const theme = createTheme();

const ButtonStyle = styled(Button)({
  backgroundColor: "green",
  textTransform: "inherit",
  fontSize: "1rem",
  "&:hover": {
    backgroundColor: "lime",
  },
  //   up => min-width
  // down => max-width
  [theme.breakpoints.down("sm")]: {
    span: {
      fontSize: "0.8rem",
    },
  },
});

function ButtonEvent(props) {
  function handleClick() {
    onClick();
  }
  const { onClick } = props;
  return (
    <Box>
      <ButtonStyle
        variant="contained"
        startIcon={<FaUpload />}
        onClick={handleClick}
      >
        <span>Demo</span>
      </ButtonStyle>
    </Box>
  );
}

export default ButtonEvent;
