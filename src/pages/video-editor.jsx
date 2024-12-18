import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Header from "../components/layouts/header";
import VideoTime from "../components/video-time";
import { Box, Button, IconButton, Slider, Typography } from "@mui/material";
import { GoMute, GoUnmute } from "react-icons/go";
import { FaVolumeDown, FaVolumeUp } from "react-icons/fa";
import { FaPause, FaPlay } from "react-icons/fa6";
import { FaVolumeMute } from "react-icons/fa";
import { AiOutlineFullscreen } from "react-icons/ai";
import myVideo from "../assets/videos/where-our-blue.mp4";

const VideoEditor = () => {
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isSound, setIsSound] = useState(false);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleSeek = (time) => {
    playerRef.current.seekTo(time);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const handleDataVolume = (_event, newValue) => {
    console.log(newValue);
    setVolume(newValue);
  };

  const handleMuted = () => {
    if (volume === 0) {
      setVolume(0.5);
    }
    setMuted(!muted);
  };

  const volumeUp = () => {
    setVolume((prevVolume) => Math.min(prevVolume + 0.1, 1.0)); // Increase volume by 10%, max 1.0
  };

  const volumeDown = () => {
    setVolume((prevVolume) => Math.max(prevVolume - 0.1, 0.0)); // Decrease volume by 10%, min 0.0
  };

  // 100 seconds => 1:30
  // ແຕ່ ນັບເປັນ interval
  // 20 seconds => 00:30
  function convertSecondsToMinutes(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    let secondFinal = Math.round(remainingSeconds);
    if (secondFinal === "60") {
      secondFinal = "00";
    }

    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${secondFinal}`;
  }

  // 100 seconds => 1:30
  function convertToLongTimer(seconds) {
    const totalMinutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);

    const data = `${totalMinutes} :${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;

    return data;
  }

  const handleFullscreen = () => {
    if (playerRef.current) {
      const playerContainer = playerRef.current.wrapper; // Access the player container
      if (playerContainer) {
        if (playerContainer.requestFullscreen) {
          playerContainer.requestFullscreen();
        } else if (playerContainer.mozRequestFullScreen) {
          // Firefox
          playerContainer.mozRequestFullScreen();
        } else if (playerContainer.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          playerContainer.webkitRequestFullscreen();
        } else if (playerContainer.msRequestFullscreen) {
          // IE/Edge
          playerContainer.msRequestFullscreen();
        }
      }
    }
  };

  const result = React.useMemo(() => {
    return convertSecondsToMinutes(currentTime);
  }, [currentTime]);

  const dataDuration = React.useMemo(() => {
    const data = convertToLongTimer(duration);
    return data;
  }, [duration]);

  useEffect(() => {
    if (volume === 0 && muted) {
      setVolume(0.5);
    }
  }, [muted, volume]);

  const playVideo = async () => {
    try {
      await playerRef.current?.getInternalPlayer()?.play();
      setPlaying(true);
    } catch (err) {
      console.warn("Autoplay blocked or error:", err);
    }
  };
  useEffect(() => {
    playVideo();
  }, []);

  useEffect(() => {
    document.addEventListener("click", playVideo);
    return () => document.removeEventListener("click", playVideo);
  }, []);

  return (
    <React.Fragment>
      <Header />

      <Box sx={{ maxWidth: "990px", margin: "0 auto", padding: "0.8rem 2rem" }}>
        <Box
          onMouseEnter={() => {
            setIsHover(true);
          }}
          onMouseLeave={() => {
            setIsHover(false);
          }}
          sx={{
            mt: 1.5,
            mb: 2,
            position: "relative",
          }}
        >
          {/* video player */}
          <Box>
            <ReactPlayer
              ref={playerRef}
              controls={false}
              url={myVideo}
              playing={playing}
              onPlay={() => {
                setPlaying(true);
              }}
              onPause={() => {
                setPlaying(false);
              }}
              width="100%"
              style={{
                borderRadius: "6px",
                pointerEvents: isHover ? "none" : "auto",
              }}
              onProgress={handleProgress}
              onDuration={handleDuration}
              volume={volume}
              muted={muted}
            />
          </Box>

          {/* icon on play and pause */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // Center the icon button perfectly
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isHover && !playing && (
              <IconButton
                onClick={togglePlayPause}
                sx={{
                  fontSize: "1.2rem",
                  background: "#fff",
                  "&:hover": {
                    backgroundColor: "#fff",
                  },
                }}
                size="large"
              >
                {playing ? <FaPause /> : <FaPlay />}
              </IconButton>
            )}
          </Box>

          {/* action on play videos */}

          <Box
            sx={{
              // opacity: isHover ? "1" : "0",
              transition: "0.2s all",
            }}
          >
            {/* play time */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                bottom: 35,
                width: "100%",
                zIndex: 99,
              }}
            >
              <VideoTime
                duration={duration}
                currentTime={currentTime}
                onSeek={handleSeek}
              />
            </Box>

            {/* play pause and play */}
            <Box sx={{ position: "absolute", left: 0, bottom: 7 }}>
              <IconButton
                sx={{ m: 0, fontSize: "1.2rem" }}
                onClick={togglePlayPause}
              >
                {playing ? <FaPause /> : <FaPlay />}
              </IconButton>
            </Box>

            {/* play sound */}
            <Box
              sx={{
                position: "absolute",
                left: 30,
                bottom: 8,
                width: "120px",
                ml: 2,
              }}
              onMouseEnter={() => {
                setIsSound(true);
              }}
              onMouseLeave={() => {
                setIsSound(false);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton size={"small"} sx={{ mr: 1 }} onClick={handleMuted}>
                  {muted ? (
                    <GoMute />
                  ) : volume === 0 ? (
                    <GoMute />
                  ) : (
                    <GoUnmute />
                  )}
                </IconButton>

                <Box
                  sx={{
                    width: "120px",
                    opacity: isSound ? "1" : "0",
                    transition: "0.2s all ease-in-out",
                  }}
                >
                  <Slider
                    size="small"
                    aria-label="Volume"
                    value={volume}
                    onChange={handleDataVolume}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </Box>
              </Box>
            </Box>

            {/* video on real time */}
            {/* play pause and play */}
            <Box
              sx={{
                position: "absolute",
                left: isSound ? 180 : 90,
                bottom: 14,
                transition: "0.2s all ease-in-out",
              }}
            >
              <Typography
                component="p"
                sx={{ fontSize: "14px", fontWeight: "500" }}
              >
                {/* {Math.round(result.remainingSeconds)} / {dataDuration} */}
                {result} / {dataDuration}
              </Typography>
            </Box>

            {/* play screen */}
            <Box sx={{ position: "absolute", right: 0, bottom: 7 }}>
              <IconButton
                sx={{ m: 0, fontSize: "1.2rem" }}
                onClick={handleFullscreen}
              >
                <AiOutlineFullscreen />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};
//hjuoij

export default VideoEditor;
