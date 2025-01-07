import { Slider } from "@mui/material";
import React from "react";

function TimeSeek(props) {
  const {
    duration,
    currentTime,
    handleSeek,
    isHoverProgress,
    handleEnterIsHovered,
    handleLeaveIsHovered,
  } = props;
  return (
    <div
      className="absolute w-full bottom-0 right-0 px-1"
      style={{ zIndex: 999 }}
      onMouseEnter={handleEnterIsHovered}
      onMouseLeave={handleLeaveIsHovered}
    >
      <Slider
        step={1}
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        className="w-full m-0 p-0"
        sx={{
          zIndex: 999,
          "& .MuiSlider-thumb": {
            display: isHoverProgress ? "block" : "none",
            zIndex: 999,
          },

          "&.MuiSlider-root": {
            zIndex: 999,
            padding: "0px",
            paddingBottom: "2px",
            color: "#d33",
            borderRadius: "2px",
          },
        }}
      />
    </div>
  );
}

export default TimeSeek;
