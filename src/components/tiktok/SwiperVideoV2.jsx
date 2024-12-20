import React from "react";

function SwiperVideoV2({ video }) {
  return (
    <React.Fragment>
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
            src={video}
            autoPlay
            loop
            muted
            style={{ width: "100%", height: "100%" }}
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
    </React.Fragment>
  );
}

export default SwiperVideoV2;
