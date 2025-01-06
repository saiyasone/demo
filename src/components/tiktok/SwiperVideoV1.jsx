import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export const SwiperVideoV1 = ({ isMobile }) => {
  const video =
    "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/okfiuJ5KSOafQAEmMjZFEIwDCCXugIjBfxoAgD/?a=1988&bti=NDU3ZjAwOg%3D%3D&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1824&bt=912&cs=0&ds=6&ft=-Csk_mxjPD12NZrxAE-Ux7y2aY6e3wv25-cAp&mime_type=video_mp4&qs=0&rc=Ozo1NjdnOTg3ZzM1aGk1ZUBpajc5NnI5cnI8dzMzODczNEAuLi5iNmMzXjAxYS02MGJeYSNvbV5lMmRrYy1gLS1kMTFzcw%3D%3D&src=1&btag=e00090000&expire=1736244542&l=2025010510071479D159A1FCF0E7730B0F&ply_type=2&policy=2&signature=d319f9117113fdd5f4378bb2cea76b4c&tk=tt_chain_token";
  const video1 =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video2 =
    "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";
  const video3 =
    "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037/oYMnS7rXFAilQVnMgIF3T3cD6f41ec9EBCBhPE/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=998&bt=499&cs=0&ds=6&ft=-Csk_mxjPD12NjOpAE-UxKK2aY6e3wv25NcAp&mime_type=video_mp4&qs=0&rc=N2U4OGU7NDU2aDVmZmRoOUBpam9pOmw5cnh3dzMzODgzNEA1MTM1LV4yXi4xMS1iL18wYSNvcS5nMmRraTRgLS1kL2Bzcw%3D%3D&btag=e00090000&expire=1736351272&l=20250106154621730CDC3D839BD896C3EB&ply_type=2&policy=2&signature=50e4b677b61a49875c8ed5c0621c5fa6&tk=tt_chain_token";
  const video4 =
    "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/ooEVuDjIIDAfJERvQOHAdx3doCFfdY3DrZrSCf/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2234&bt=1117&cs=0&ds=6&ft=-Csk_mxjPD12NKOpAE-UxE12GY6e3wv252cAp&mime_type=video_mp4&qs=0&rc=OjU4aWRnOWY7Z2k8O2c1aEBpandzcXk5cm5vdzMzODczNEA0NjFhLTQwXzYxLl41My8xYSNsbmFvMmRrc2tgLS1kMTFzcw%3D%3D&src=1&btag=e000b8000&expire=1736351249&l=20250106154705E0B96FC1E2A99298A83C&ply_type=2&policy=2&signature=f45d23c98debb0337177f6d655e85f30&tk=tt_chain_token";

  const videoRefs = React.useRef([]);
  const videos = [
    // {
    //   key: 1,
    //   video,
    // },
    {
      key: 2,
      video: video2,
    },
    {
      key: 3,
      video: video1,
    },
    // {
    //   key: 4,
    //   video: video3,
    // },
    // {
    //   key: 5,
    //   video: video4,
    // },
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

  const handleEnded = () => {
    const video = videoRefs.current[playingIndex];
    setTimeout(() => {
      video.seekTo(0);
      video.getInternalPlayer().play();
    }, 1500);
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
                    width={"100%"}
                    height={"100%"}
                    onEnded={handleEnded}
                    onProgress={(state) => {
                      console.log(state.played);
                      const playedPercentage = state.played;
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
                    <p className="font-bold">username ({progress}) </p>
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
                className="absolute w-full bottom-0 left-0 right-0 bg-slate-300 z-50"
                style={{
                  height: "5px",
                }}
              >
                <div
                  className="bg-red-600 transition-all ease-in-out delay-150"
                  style={{
                    width: `${progress * 100}%`,
                    height: "inherit",
                  }}
                ></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </React.Fragment>
  );
};
