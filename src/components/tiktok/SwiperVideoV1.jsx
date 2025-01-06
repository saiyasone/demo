import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import React, { useState } from "react";
import ReactPlayer from "react-player";

export const SwiperVideoV1 = ({ isMobile }) => {
  const video =
    "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";
  const video1 =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video2 =
    "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";

  const videoRefs = React.useRef([]);
  const videos = [
    // {
    //   key: 1,
    //   video,
    // },
    {
      key: 2,
      video: video1,
    },
    {
      key: 3,
      video: video2,
    },
  ];
  const [playingIndex, setPlayingIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const handleSlideChangeV1 = (swiper) => {
    setPlayingIndex(swiper.activeIndex);
    setProgress(0);
    setIsPlaying(true);

    // Reset all videos and play the active one
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

    fetchDuration();
  };

  const togglePlayPause = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    if (isPlaying && index === playingIndex) {
      video.getInternalPlayer().pause();
      setIsPlaying(false);
    } else {
      video.getInternalPlayer().play();
      setIsPlaying(true);
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
      setProgress(0);
      const duration = activeVideoRef.getDuration();
      setDuration(duration);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          maxWidth: isMobile ? "100%" : "400px",
          overflow: "hidden",
          marginTop: isMobile ? "" : "1rem",
          // marginLeft: isMobile ? "10px" : "",
          // marginRight: isMobile ? "10px" : "",
          borderRadius: isMobile ? "" : "6px",
        }}
        className="mx-auto relative bg-zinc-950 flex items-center justify-center feed-container"
      >
        <Swiper
          direction={"vertical"}
          modules={[Navigation, Autoplay, Mousewheel]}
          spaceBetween={20}
          mousewheel={{ forceToAxis: true }}
          // className="w-full h-full"
          // style={{ height: isMobile ? "600px" : "650px" }}
          style={{ height: "100%", width: "100%" }}
          onSlideChange={handleSlideChangeV1}
        >
          {videos.map((item, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full flex items-center justify-center"
            >
              <div
                className="relative rounded-md w-full"
                onClick={() => togglePlayPause(index)}
              >
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
                    muted={true}
                    playing={playingIndex === index}
                    autoPlay={true}
                    loop={true}
                    width={"100%"}
                    height={"100%"}
                    onEnded={() => {
                      // setProgress(100);
                    }}
                    onProgress={(state) => {
                      const playedPercentage = state.played * 100;
                      setProgress(playedPercentage);
                    }}
                    onDuration={(duration) => {
                      onDuration(duration, index);
                    }}
                    onReady={fetchDuration}
                    style={{
                      objectFit: "cover",
                      maxHeight: isMobile ? "100%" : "650px",
                    }}
                  />
                </div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col rounded-lg justify-between p-4 text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="font-bold">username </p>
                    <p className="text-sm text-gray-300">@userhandle</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm mb-4">
                    <span className="font-bold">username</span> This is a sample
                    video description #hashtag #shorts
                  </p>

                  <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-4">
                    <div className="flex gap-2 items-center">
                      <button
                        className="p-2 bg-gray-800 rounded-full"
                        // onClick={() => toggleComments(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="w-6 h-6"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 6.5A4.5 4.5 0 0016.5 2h-9A4.5 4.5 0 003 6.5v9A4.5 4.5 0 007.5 20h3.586l2.828 2.828A2 2 0 0016.5 20h1.914A4.5 4.5 0 0021 15.5v-9zm-9 11h-3.586l-2.828-2.828A2 2 0 017.5 15h9a2 2 0 002-2v-9a2 2 0 00-2-2h-9a2 2 0 00-2 2v9a2 2 0 002 2H12z" />
                        </svg>
                      </button>
                      {/* <span className="text-sm">3.2K</span> */}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute bottom-0 h-1 left-0 right-0 bg-red-500 z-50 transition-all ease-in-out delay-150"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div> 
    </React.Fragment>
  );
};
