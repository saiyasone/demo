import {
  Box,
  Button,
  keyframes,
  styled,
  Tabs,
  createTheme,
} from "@mui/material";
const theme = createTheme();

export const ChannelContainer = styled(Box)({
  backgroundColor: "#FFFFFF",
  padding: 10,
  width: "100%",
});

export const ChannelHeader = styled(Box)({
  width: "100%",
  marginTop: 10,
  marginBottom: 0,
});

export const EmptyDashedBorderBox = styled(Box)({
  marginBottom: 3,
});

export const ChannelTabsContainer = styled(Box)({
  marginTop: 5,
});

export const CustomTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    gap: 10,
    overflowY: "auto",
    padding: "0 10px 10px",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
  "& .MuiTab-root": {
    minWidth: 0,
    minHeight: "32px",
    borderRadius: "20px",
    padding: "3px 25px 5px",
    fontSize: "16px",
    textTransform: "none",
    color: "#6E6E6E",
    backgroundColor: "#F1F1F1",
    "&.Mui-selected": {
      color: "#FFFFFF",
      backgroundColor: "#6E6779",
    },
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
});

export const CommentContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
}));

export const VideoCardContainer = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 2,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "black",
  width: "40vw",
  height: "87vh",
  maxHeight: "87vh",
  marginBottom: 5,
  paddingBottom: "15px",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  [theme.breakpoints.down("md")]: {
    width: "100vw",
  },
}));

export const FeedVideoChannelContainer = styled(Box)(() => ({
  position: "absolute",
  bottom: 10,
  left: 0,
  padding: "2px",
  borderRadius: "8px",
  color: "white",
  maxWidth: "50%",
}));

export const ChannelCard = styled(Box)(() => ({
  padding: "2px 5px",
  display: "flex",
  alignItems: "center",
  gap: 8,
}));

export const ChannelAvatar = styled(Box)(() => ({
  position: "relative",
  cursor: "pointer",
}));

export const ChannelFollowIcon = styled(Box)(() => ({
  position: "absolute",
  bottom: -8,
  left: 17,
  cursor: "pointer",
}));
export const DescriptionTitle = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  color: "white",
}));

export const CommentMenuContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  alignItems: "center",
  position: "absolute",
  right: -80,
  height: "100%",
  background: "white",
  zIndex: 10,
  [theme.breakpoints.down("md")]: {
    right: 0,
    top: 0,
    height: "87%",
    background: "none",
  },
}));

export const WrapButtonContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "1.2rem",

  [theme.breakpoints.down(600)]: {
    zIndex: 999,
  },
  [theme.breakpoints.down("lg")]: {
    marginBottom: ".8rem",
  },
}));

export const WrapButton = styled(Box)(({ theme }) => ({
  width: "50px",
  height: "50px",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  [theme.breakpoints.down("lg")]: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
}));

export const slideInFromLeft = keyframes`
      0% {
        width: 0;
        opacity: 0.3;
      }
      100% {
        width::'30vw';
        opacity: 1;
      }
    `;

export const slideInFromBottom = keyframes`
      0% {
        heigth: 0;
        opacity: 0.7;
      }
      100% {
        heigth::'60vw';
        opacity: 1;
      }
    `;

export const CommentPane = styled(Box)(({ theme }) => ({
  position: "relative",
  backgroundColor: "transparent",
  overflowY: "auto",
  maxHeight: "87vh",
  width: "100%",
  boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
  // marginLeft: "75px",
  marginBottom: 1,
  scrollBehavior: "smooth",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    width: "0",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  transition: "width 0.3s ease",
  "&.show": {
    width: "30vw",
    animation: `${slideInFromLeft} 0.3s ease forwards`,
  },

  [theme.breakpoints.down("md")]: {
    // backgroundColor: "white",
    // position: "absolute",
    // bottom: 0,
    // left: 0,
    // marginLeft: 0,
    // minWith: "100vw",
    // heigth: "0vh",
    // transition: "height 0.5s ease",
    // zIndex: 20,
    "&.show": {
      minWidth: "100vw",
      height: "60vh",
      animation: `${slideInFromBottom} 0.5s ease forwards`,
    },
  },
}));

export const CommentCard = styled(Box)(({ theme }) => ({
  minHeight: "73.5vh",
  maxHeight: "73.5vh",
  padding: 5,
  backgroundColor: "transparent",
  overflowY: "auto",
  height: "9%",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(0, 0, 0, 0.1)",
  },
  [theme.breakpoints.down("md")]: {
    minHeight: "45vh",
    maxHeight: "45vh",
  },
}));

export const MoreButtonsContainer = styled(Box)(({ theme }) => ({
  background: "white",
  position: "absolute",
  bottom: "5%",
  left: "70%",
  zIndex: 99988,
  padding: 7,
  minWidth: "200px",
  borderRadius: 5,
  boxShadow: "rgba(0, 0, 0, 0.25) 0px 3px 50px 25px",
  [theme.breakpoints.down("md")]: {
    left: "calc(100% - 230px)",
    bottom: "10%",
  },
}));

export const MoreButton = styled(Button)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  minWidth: "100%",
  textWrap: "nowrap",
  whiteSpace: "nowrap",
  wordBreak: "keep-all",
  "&:hover": {
    background: "rgba(23,118,107, 0.1)",
  },
});

export const FeedPlayerContainer = styled("div")({
  width: "100%",
  height: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "0.6rem",
  overflow: "hidden",
  cursor: "pointer",
  position: "relative",

  video: {
    width: "336px",
    height: "600px",
    objectFit: "contain",
    backgroundColor: "#000",
  },
});

export const FeedPlayerDuration = styled("div")({
  position: "absolute",
  bottom: "0",
  zIndex: 99,
  height: "4px",
  backgroundColor: "#d9d9d9",
  borderRadius: "3px",
  left: "0",
  right: "0",
});

export const FeedPlayerLayout = styled("div")({
  borderRadius: "0.6rem",
  width: "100%",
  height: "100%",
  gridTemplateRows: "auto",
  overflow: "hidden",
});

export const FeedAvatarBox = styled("div")({
  position: "absolute",
  bottom: "20px",
  left: "0",
  padding: "0 1rem",
  pointerEvents: "auto",
  zIndex: 99,
});

export const FeedBoxActionContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",

  position: "absolute",
  right: "12%",
  bottom: "0",

  [theme.breakpoints.down(600)]: {
    right: "2%",
  },
});

export const VideoFullPreview = styled(Box)({
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,1)",
  borderColor: "rgba(132, 129, 142, 0.3)",
  borderRadius: 1,
  overflow: "hidden",
  "&: hover": {
    cursor: "pointer",
  },
});
