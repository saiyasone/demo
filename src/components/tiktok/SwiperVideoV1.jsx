import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { UAParser } from "ua-parser-js";
import { FaBookmark, FaCommentDots, FaHeart } from "react-icons/fa";
import { GoMute, GoUnmute } from "react-icons/go";
import { videosOnlines } from "../../constants/video.constant";
import { Slider } from "@mui/material";
import TimeSeek from "./TimeSeek";
import FeedAction from "./FeedAction";

export const SwiperVideoV1 = ({ isMobile }) => {
  const [platform, setPlatform] = useState("");
  const [tablet, setTablet] = useState("");
  const [isBuffer, setIsBuffer] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = React.useRef([]);
  const swiperRef = useRef(null);

  const [playingIndex, setPlayingIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isHoverProgress, setIsHoverProgress] = useState(false);

  const handleSlideChangeV1 = (swiper) => {
    setPlayingIndex(swiper.activeIndex);

    setIsPlaying(true);

    // Reset all videos and play the active one
    try {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === swiper.activeIndex) {
            video.seekTo(0); // Reset active video to start
            video.getInternalPlayer().play(); // Play the active video
          } else {
            video.getInternalPlayer().pause(); // Pause other videos
            video.seekTo(0); // Reset other videos to start
          }
        }
      });
    } catch (error) {
      console.log("playing video failed", error);
    }

    fetchDuration();
  };

  const handleIsMuted = () => {
    setIsMuted(!isMuted);
  };

  const handleEnterIsHovered = () => {
    setIsHoverProgress(true);
  };
  const handleLeaveIsHovered = () => {
    setIsHoverProgress(false);
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    try {
      if (isPlaying && index === playingIndex) {
        video.getInternalPlayer().pause();
        setIsPlaying(false);
      } else {
        video.getInternalPlayer().play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("playing video failed", error);
    }
  };

  const onDuration = (duration, index) => {
    if (index === playingIndex) {
      setDuration(duration);
    }
  };

  const fetchDuration = () => {
    const activeVideoRef = videoRefs.current[playingIndex];
    if (activeVideoRef && activeVideoRef.getDuration) {
      const duration = activeVideoRef.getDuration();
      setDuration(duration);
    }
  };

  const handleEnded = () => {
    const video = videoRefs.current[playingIndex];
    setTimeout(() => {
      video.seekTo(0);
      video.getInternalPlayer().play();
    }, 500);
  };

  const handleNavigateTop = () => {
    if (playingIndex === 0) {
      console.log("first video");
      return;
    }

    swiperRef.current.slidePrev();
  };

  const handleSeek = (_event, newValue) => {
    setIsPlaying(false);
    if (videoRefs.current) {
      const videoRef = videoRefs.current[playingIndex];
      const timeSeek = parseFloat(newValue);
      videoRef.seekTo(timeSeek);
    }
  };

  const handleNavigateDown = () => {
    if (videosOnlines.length - 1 === playingIndex) {
      console.log("ending video");
      return;
    }
    swiperRef.current.slideNext();
  };

  useEffect(() => {
    const ua = new UAParser();
    const type = ua.getDevice().type;
    if (ua.getDevice().type === "mobile") {
      setPlatform("mobile");
    }

    if (type === "tablet") {
      setPlatform("mobile");
      setTablet("tablet");
    }
  }, []);

  return (
    <React.Fragment>
      {platform === "mobile" && (
        <TimeSeek
          currentTime={currentTime}
          duration={duration}
          isHoverProgress={isHoverProgress}
          handleSeek={handleSeek}
          handleEnterIsHovered={handleEnterIsHovered}
          handleLeaveIsHovered={handleLeaveIsHovered}
        />
      )}

      <div
        style={{
          maxWidth: platform === "mobile" ? "100%" : "400px",
          overflow: "hidden",
          marginTop: platform === "mobile" ? "" : "2rem",
          borderRadius: platform === "mobile" ? "" : "6px",
          height: platform === "mobile" ? "100vh" : "",
        }}
        className="mx-auto relative bg-zinc-950 flex items-center justify-center feed-container"
      >
        <Swiper
          ref={swiperRef}
          direction={"vertical"}
          modules={[Navigation, Autoplay, Mousewheel]}
          spaceBetween={20}
          mousewheel={{ forceToAxis: true }}
          style={{ height: "100%", width: "100%", position: "relative" }}
          onSlideChange={handleSlideChangeV1}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
        >
          {videosOnlines.map((item, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full flex items-center justify-center relative"
              // onMouseEnter={handleEnterIsHovered}
              // onMouseLeave={handleLeaveIsHovered}
            >
              <div className="relative rounded-md w-full">
                <div
                  style={{
                    height: "100%",
                    background: "#000",
                    overflow: "hidden",
                    maxHeight: "100%",
                  }}
                  className="bg-zinc-950 relative"
                >
                  <ReactPlayer
                    ref={(el) => (videoRefs.current[index] = el)}
                    url={item.video}
                    muted={isMuted}
                    playing={playingIndex === index}
                    autoPlay={true}
                    width={"100%"}
                    height={tablet ? "100vh" : "100%"}
                    onEnded={handleEnded}
                    onBuffer={() => {
                      console.log("Loading while buffering ...");
                      setIsBuffer(true);
                    }}
                    onPlay={() => {
                      // setIsMuted(false);
                    }}
                    onBufferEnd={() => {
                      console.log("Ending on buffered ...");
                      setIsBuffer(false);
                    }}
                    onProgress={(state) => {
                      setCurrentTime(state.playedSeconds);
                    }}
                    onDuration={(duration) => {
                      onDuration(duration, index);
                    }}
                    onReady={fetchDuration}
                    style={{
                      objectFit: "cover",
                      maxHeight: platform === "mobile" ? "100vh" : "650px",
                    }}
                    onError={(err) => {
                      try {
                        if (err?.message) {
                          console.error("Error message:", err.message);
                        } else {
                          console.error("An error occurred:", err);
                        }

                        // Check for specific unsupported source error
                        if (
                          err?.target?.error?.code ===
                          MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
                        ) {
                          console.error("The element has no supported source.");
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col rounded-lg justify-between p-4 text-white">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center">
                    <div className="playing-sound">
                      <button
                        className={`p-3 bg-gray-800 rounded-full ${
                          tablet ? "text-3xl" : "text-lg"
                        }`}
                        onClick={handleIsMuted}
                      >
                        {isMuted ? <GoMute /> : <GoUnmute />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-lg mb-4">
                    <span className="font-bold">username</span> This is a sample
                    video description #hashtag #shorts
                  </p>

                  {platform === "mobile" && (
                    <FeedAction
                      tablet={tablet}
                      handleNavigateDown={handleNavigateDown}
                      handleNavigateTop={handleNavigateTop}
                      togglePlayPause={togglePlayPause}
                    />
                  )}
                </div>
              </div>

              {!platform && (
                <TimeSeek
                  currentTime={currentTime}
                  duration={duration}
                  isHoverProgress={isHoverProgress}
                  handleSeek={handleSeek}
                  handleEnterIsHovered={handleEnterIsHovered}
                  handleLeaveIsHovered={handleLeaveIsHovered}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </React.Fragment>
  );
};
