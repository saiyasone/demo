import React from "react";

const TikTokFixedVideo = () => {
  const video =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/957639573_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video1 =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";

  return (
    <div className="my2">
      <div
        style={{ maxWidth: "400px", height: "650px", marginTop: "2.5rem" }}
        className="mx-auto relative h-full bg-black rounded-lg flex items-center justify-center"
      >
        <div className="relative rounded-md" style={{}}>
          <div
            style={{
              height: "100%",
              background: "#000",
              overflow: "hidden",
            }}
            className="bg-black relative"
          >
            <video
              className="w-full h-full object-cover bg-black overflow-hidden"
              src={video}
              autoPlay
              loop
              muted
              style={{ orderRadius: "10px" }}
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
              <span className="font-bold">username</span> This is a sample video
              description #hashtag #shorts
            </p>

            <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-4">
              <div className="flex flex-col items-center">
                <button className="p-2 bg-gray-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
                <span className="text-sm">123.4K</span>
              </div>

              <div className="flex flex-col items-center">
                <button className="p-2 bg-gray-800 rounded-full">
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

              <div className="flex flex-col items-center">
                <button className="p-2 bg-gray-800 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-6 h-6"
                    viewBox="0 0 24 24"
                  >
                    <path d="M13 10h-2v2h2zm0 4h-2v2h2zm0-8h-2v2h2z" />
                  </svg>
                </button>
                <span className="text-sm">Share</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TikTokFixedVideo;
