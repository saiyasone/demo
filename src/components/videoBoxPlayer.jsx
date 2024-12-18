import { Box, keyframes } from "@mui/material";
import React from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

function FeedBoxPlayer(props) {
  const { handleVideoClick, isHover, isPlaying, isScale } = props;
  const slideInFromLeft = keyframes`
  0% {
    opacity: 0.1;
  }
  25% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
  75% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
  `;

  return (
    <Box
      onClick={() => handleVideoClick?.()}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
        fontSize: "2rem",
      }}
    >
      {isHover && (
        <React.Fragment>
          <Box
            sx={{
              transition: "0.3s ease",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              transform: isScale ? "scale(1.1)" : "scale(0.5)",
              animation: `${slideInFromLeft} 0.3s ease`,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              verticalAlign: "middle",
            }}
          >
            {isPlaying ? <FaPlay /> : <FaPause />}
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

export default FeedBoxPlayer;
