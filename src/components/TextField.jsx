import { Box, TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomInput = styled(TextField)({
  "& .MuiInputBase-input": {
    fontSize: "1rem",
  },
});

function AppTextField(props) {
  const { placeholder } = props;
  const placeData = placeholder || "example";

  return (
    <Box>
      <CustomInput size="small" placeholder={placeData} label="Label" variant="outlined" />
    </Box>
  );
}

export default AppTextField;
