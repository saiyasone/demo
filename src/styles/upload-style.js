import { styled } from "@mui/material";

export const UploadFolderContainer = styled("div")({
  borderRadius: "10px",
  border: "1px solid #eee",
  backgroundColor: "#fff",
});

export const UploadFolderHeaderContainer = styled("div")({
  width: "inherit",
  backgroundColor: "#F5F5F5",
  padding: "12px",
});

export const UploadFolderHeader = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  overflow: "hidden",

  h4: {
    color: "#4B465C",
    fontSize: "16px",
    fontWeight: "bold",
  },

  button: {
    cursor: "pointer",
    fontSize: "16px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    padding: "6px 8px",
    borderRadius: "5px",
    transition: "0.3s all",
  },
});

export const UploadFolderCancelButton = styled("button")({
  color: "#4B465C",
  "&:focus": {
    backgroundColor: "#F0F0F0",
  },
});

export const UploadFolderAddMoreButton = styled("button")({
  color: "#17766B",
  "&:focus": {
    backgroundColor: "#C7E3E0",
  },
});

export const UploadFolderBody = styled("div")(({ isDrag }) => ({
  padding: "20px",
  // height: "350px",
  minHeight: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  ...(isDrag && {
    border: "2px dashed #0087F7",
    textAlign: "center",

    "&*": {
      display: "none",
    },
  }),
}));
export const ButtonActionContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginTop: "1.6rem",

  button: {
    fontSize: "0.93rem",
    borderRadius: "5px",
    padding: "12px 18px",
    border: "none",
    outline: "none",
    cursor: "pointer",
  },
});

export const ButtonCancelAction = styled("button")({
  backgroundColor: "#E5E6E7",
  color: "#4B465C",
  "&:hover": {
    backgroundColor: "#cecece",
  },
});

export const ButtonUploadAction = styled("button")({
  backgroundColor: "#17766B",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#10524a",
  },
});

// ========== Files ============= //
export const UploadFilesContainer = styled("div")({
  maxWidth: "992px",
  margin: "0 auto",
});
