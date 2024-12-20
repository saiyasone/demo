import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Autoplay, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export const SwiperVideoV1 = ({ isMobile }) => {
  const video =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/957639573_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
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
    <div
      style={{
        maxWidth: isMobile ? "100%" : "400px",
        height: isMobile ? "600px" : "650px",
        overflow: "hidden",
      }}
      className="mx-auto relative h-full bg-zinc-950 rounded-md"
    >
      <Swiper
        direction={"vertical"}
        modules={[Navigation, Autoplay, Mousewheel]}
        onSlideChange={() => {}}
        spaceBetween={20}
        mousewheel={{ forceToAxis: true }}
        className="w-full h-full relative flex items-center justify-center"
      >
        {videos.map((video, index) => (
          <SwiperSlide key={index}>
            <div className="relative rounded-md">
              <div
                style={{
                  height: "100%",
                  background: "#000",
                  overflow: "hidden",
                }}
                className="bg-zinc-950 relative"
              >
                <video
                  className="bg-zinc-950 object-fill"
                  src={video.video}
                  autoPlay
                  width={"100%"}
                  height={"100%"}
                  loop
                  muted
                />
              </div>
            </div>

            {/* Overlay Content */}
            {/* <div className="absolute inset-0 flex flex-col rounded-lg justify-between p-4 text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-full bg-gray-500"></div>
                      <div>
                        <p className="font-bold">username</p>
                        <p className="text-sm text-gray-300">@userhandle</p>
                      </div>
                    </div>
  
                    <div>
                      <p className="text-sm mb-4">
                        <span className="font-bold">username</span> This is a
                        sample video description #hashtag #shorts
                      </p>
  
                      <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center">
                          <button
                            className="p-2 bg-gray-800 rounded-full"
                            onClick={() => toggleComments(true)}
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
                  </div> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
