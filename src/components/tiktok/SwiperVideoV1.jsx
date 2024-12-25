import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import React from "react";

export const SwiperVideoV1 = ({ isMobile }) => {
  const video =
    "https://s3.ap-southeast-1.wasabisys.com/server2coding.vshare.net/tiktok_feeds/00c0857f-36d5-4ef0-bc7a-aa01a1c9bd6c/tiktok/a02a8d5a-fb57-4cc4-ba89-2d6a4a59fdc256a85347-6f5a-47e4-a92d-d697755cde27_video_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ZPFGJNFWS7M1WIE3I3ZH%2F20241225%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20241225T095417Z&X-Amz-Expires=3600&X-Amz-Signature=9d898c16561150aecb84257d2e3c8dbf1cd53b3dc7f201d246d5b25caecf7fbb&X-Amz-SignedHeaders=host&x-id=GetObject";
  const video1 =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video2 =
    "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";

  const videos = [
    {
      key: 1,
      video,
    },
    {
      key: 2,
      video: video1,
    },
    {
      key: 3,
      video: video2,
    },
  ];

  return (
    <React.Fragment>
      <div
        style={{
          maxWidth: isMobile ? "100%" : "400px",
          overflow: "hidden",
          marginTop: isMobile ? "2rem" : "1rem",
          marginLeft: isMobile ? "10px" : "",
          marginRight: isMobile ? "10px" : "",
          // height: isMobile ? "550px" : "650px",
        }}
        className="mx-auto relative bg-zinc-950 rounded-md flex items-center justify-center feed-container"
      >
        <Swiper
          direction={"vertical"}
          modules={[Navigation, Autoplay, Mousewheel]}
          onSlideChange={() => {}}
          spaceBetween={20}
          mousewheel={{ forceToAxis: true }}
          // className="w-full h-full"
          // style={{ height: isMobile ? "600px" : "650px" }}
          style={{ height: "100%", width: "100%" }}
        >
          {videos.map((item, index) => (
            <SwiperSlide
              key={index}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="relative rounded-md w-full">
                <div
                  style={{
                    height: "100%",
                    background: "#000",
                    overflow: "hidden",
                  }}
                  className="bg-zinc-950 relative"
                >
                  <video
                    src={item.video}
                    autoPlay
                    loop
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      maxHeight: isMobile ? "600px" : "650px",
                    }}
                  />
                </div>
              </div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col rounded-lg justify-between p-4 text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="font-bold">username</p>
                    <p className="text-sm text-gray-300">@userhandle</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm mb-4">
                    <span className="font-bold">username</span> This is a sample
                    video description #hashtag #shorts
                  </p>

                  <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center">
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
                      <span className="text-sm">3.2K</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </React.Fragment>
  );
};
