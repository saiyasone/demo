import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import {
  FeedBoxActionContainer,
  FeedPlayerContainer,
  FeedPlayerDuration,
  FeedPlayerLayout,
  VideoFullPreview,
} from "../styles/video.style";
import { VideoConstants } from "../constants/video.constant";
import FeedBoxPlayer from "../components/videoBoxPlayer";
import ReactPlayer from "react-player";
import { useMemo } from "react";

function VideoPreview() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState([]);
  const [isHover, setIsHover] = useState(false);
  const [isScale, setIsScale] = useState(false);
  const playerRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const durationPlaceholder = duration || 0;

  const handleSlideChange = (swiper) => {
    setDuration(0);
    setCurrentTime(0);

    playerRefs.current.forEach((player) => {
      player?.getInternalPlayer()?.pause();
    });

    setPlayingIndex(swiper.activeIndex);

    const activePlayer = playerRefs.current[swiper.activeIndex];
    if (activePlayer) {
      activePlayer
        .getInternalPlayer()
        ?.play()
        .catch((error) => {
          console.warn("Autoplay not allowed:", error.message);
        });
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };
  const handleProgress = (state) => {
    setCurrentTime(Math.round(state.playedSeconds));
  };

  const handleVideoClick = async (index) => {
    setIsScale(false);
    setTimeout(() => {
      setIsScale(true);
    }, 100);
    const player = playerRefs.current[index];
    if (!player) return;

    const internalPlayer = player.getInternalPlayer();
    if (!internalPlayer) return;

    const isCurrentlyPlaying = isPlaying[index] || false;

    setIsHover(true);
    try {
      if (index === playingIndex) {
        // if (isCurrentlyPlaying) {
        //   internalPlayer?.pause();
        // } else {
        //   internalPlayer?.play();
        // }

        setIsPlaying((prev) => {
          const updated = [...prev];
          updated[index] = !isCurrentlyPlaying;
          return updated;
        });
      } else {
        setPlayingIndex(index);
        setIsPlaying((prev) => {
          const updated = prev.map(() => false);
          updated[index] = true;
          return updated;
        });
      }
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setIsHover(false);
    }, 800);
  };

  const totalProgress = useMemo(() => {
    if (durationPlaceholder > 0) {
      const dataProgress = (currentTime / durationPlaceholder) * 100;
      return Math.min(dataProgress, 100);
    }

    return 0;
  }, [currentTime, durationPlaceholder]);

  return (
    <React.Fragment>
      <Box
        sx={{
          height: "100%",
          overflow: "hidden",
          transition: "0.2s justifyContent all",
          width: "100%",
          position: "relative",

          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Swiper
            direction={"vertical"}
            style={{
              width: "100%",
              margin: "1rem 0",
              maxHeight: "85vh",
              height: "100%",
            }}
            modules={[Navigation, Autoplay, Mousewheel]}
            onSlideChange={handleSlideChange}
            spaceBetween={20}
            mousewheel={{ forceToAxis: true }}
          >
            {VideoConstants.map((video, index) => {
              return (
                <SwiperSlide key={index}>
                  <Box
                    sx={{ maxWidth: "100%", margin: "0 auto", height: "100%" }}
                  >
                    <FeedPlayerLayout
                      sx={{
                        display: isMobile ? "block" : "grid",
                        // gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr",
                        gridTemplateColumns: "1fr",
                      }}
                    >
                      <FeedPlayerContainer>
                        {index} . {playingIndex}
                        <ReactPlayer
                          ref={(el) => {
                            playerRefs.current[index] = el;
                          }}
                          width={"100%"}
                          height={"100%"}
                          playing={index === 0 ? true : false}
                          url={video?.source || "invalid"}
                          config={{
                            file: {
                              attributes: {
                                preload: "metadata",
                              },
                            },
                          }}
                          autoPlay={true}
                          fallback={
                            <VideoFullPreview sx={{ color: "#fff" }}>
                              <Typography>( •̀_•́ )</Typography>
                              <Typography>I n v a l i d</Typography>
                            </VideoFullPreview>
                          }
                          loop={true}
                          controls={false}
                          playbackRate={1}
                          onProgress={handleProgress}
                          onDuration={handleDuration}
                        />
                        <FeedBoxPlayer
                          isHover={isHover}
                          isPlaying={isPlaying[index]}
                          isScale={isScale}
                          handleVideoClick={() => handleVideoClick(index)}
                        />
                        <FeedPlayerDuration>
                          <Box
                            sx={{
                              height: "100%",
                              backgroundColor: "#FF004F",
                              width: `${totalProgress}%`,
                              transition: "width 0.3s ease-in-out",
                            }}
                          />
                        </FeedPlayerDuration>
                      </FeedPlayerContainer>

                      <FeedBoxActionContainer></FeedBoxActionContainer>
                    </FeedPlayerLayout>
                  </Box>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Box>
      </Box>
      {!VideoConstants.length && <>No data</>}
    </React.Fragment>
  );
}

export default VideoPreview;
