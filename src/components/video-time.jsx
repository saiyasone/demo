import { Slider } from "@mui/material";

const VideoTime = ({ duration, currentTime, onSeek }) => {
  // console.log({ duration, currentTime });
  const handleSeek = (_event, newValue) => {
    const time = parseFloat(newValue);
    onSeek(time);
  };

  return (
    <Slider
      size="small"
      min={0}
      max={duration}
      value={currentTime}
      onChangeCommitted={handleSeek}
      step={1}
    />
  );
};

export default VideoTime;
