// import { useMediaQuery } from "@mui/material";
// import React from "react";

// const TikTokFixedVideo = () => {
//   const isMobile = useMediaQuery(`(max-width: 500px)`);
//   const video =
//     "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/957639573_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
//   const video1 =
//     "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
//   const video2 =
//     "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";

//   return (
//     <div className="my2">
//       <div
//         style={{
//           maxWidth: isMobile ? "100%" : "400px",
//           height: isMobile ? "600px" : "650px",
//           marginTop: isMobile ? "2rem" : "1.8rem",
//           overflow: "hidden",
//           marginLeft: isMobile ? "10px" : "",
//           marginRight: isMobile ? "10px" : "",
//         }}
//         className="mx-auto relative h-full bg-zinc-950 rounded-lg flex items-center justify-center"
//       >
//         <div className="relative rounded-md">
//           <div
//             style={{
//               height: "100%",
//               background: "#000",
//               overflow: "hidden",
//             }}
//             className="bg-zinc-950 relative"
//           >
//             <video
//               className="bg-zinc-950 object-fill"
//               src={video1}
//               autoPlay
//               loop
//               muted
//               style={{ orderRadius: "10px", width: "100%", height: "100%" }}
//             />
//           </div>
//         </div>

//         {/* Overlay Content */}
//         <div className="absolute inset-0 flex flex-col rounded-lg justify-between p-4 text-white">
//           <div className="flex items-center space-x-2">
//             <div className="w-10 h-10 rounded-full bg-gray-500"></div>
//             <div>
//               <p className="font-bold">username</p>
//               <p className="text-sm text-gray-300">@userhandle</p>
//             </div>
//           </div>

//           <div>
//             <p className="text-sm mb-4">
//               <span className="font-bold">username</span> This is a sample video
//               description #hashtag #shorts
//             </p>

//             <div className="absolute right-4 bottom-4 flex flex-col items-center space-y-4">
//               <div className="flex flex-col items-center">
//                 <button className="p-2 bg-gray-800 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="currentColor"
//                     className="w-6 h-6"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
//                   </svg>
//                 </button>
//                 <span className="text-sm">123.4K</span>
//               </div>

//               <div className="flex flex-col items-center">
//                 <button className="p-2 bg-gray-800 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="currentColor"
//                     className="w-6 h-6"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M21 6.5A4.5 4.5 0 0016.5 2h-9A4.5 4.5 0 003 6.5v9A4.5 4.5 0 007.5 20h3.586l2.828 2.828A2 2 0 0016.5 20h1.914A4.5 4.5 0 0021 15.5v-9zm-9 11h-3.586l-2.828-2.828A2 2 0 017.5 15h9a2 2 0 002-2v-9a2 2 0 00-2-2h-9a2 2 0 00-2 2v9a2 2 0 002 2H12z" />
//                   </svg>
//                 </button>
//                 <span className="text-sm">3.2K</span>
//               </div>

//               <div className="flex flex-col items-center">
//                 <button className="p-2 bg-gray-800 rounded-full">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="currentColor"
//                     className="w-6 h-6"
//                     viewBox="0 0 24 24"
//                   >
//                     <path d="M13 10h-2v2h2zm0 4h-2v2h2zm0-8h-2v2h2z" />
//                   </svg>
//                 </button>
//                 <span className="text-sm">Share</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TikTokFixedVideo;

import { useMediaQuery, Drawer } from "@mui/material";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import SwiperVideoV2 from "../components/tiktok/SwiperVideoV2";
import { SwiperVideoV1 } from "../components/tiktok/SwiperVideoV1";

const TikTokFixedVideo = () => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const isMobile = useMediaQuery(`(max-width: 500px)`);
  const video =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/957639573_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video1 =
    "https://load.vshare.net/preview?path=tzhu0mm2f0h-24/2408726c-3211-440a-be66-06882f83c8bd/0fac7233-c97a-41c7-8e38-718706c32f26/1028183517_w2tpOTgifo5x0Ftjp2xtGjkOy.mp4";
  const video2 =
    "https://videos.pexels.com/video-files/27906428/12258960_1440_2560_25fps.mp4";

  const toggleComments = (open) => {
    setIsCommentOpen(open);
  };

  return (
    <React.Fragment>
      <div className="mb-2 flex items-center justify-center mt-7 sm:mt-4">
        {/* <SwiperVideoV2 isMobile={isMobile} video={video1} /> */}

        <SwiperVideoV1 isMobile={isMobile} />
      </div>

      {/* Comment Drawer */}
      <Drawer
        anchor="right"
        open={isCommentOpen}
        onClose={() => toggleComments(false)}
        PaperProps={{
          style: {
            width: isMobile ? "100%" : "400px",
            padding: "1rem",
            backgroundColor: "#1a1a1a",
            color: "white",
          },
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Comments</h2>

          <FaTimes
            className="text-white text-gl cursor-pointer"
            onClick={() => toggleComments(false)}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-500"></div>
            <p className="flex-1 text-sm">
              <span className="font-bold">user1</span> Nice video!
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-500"></div>
            <p className="flex-1 text-sm">
              <span className="font-bold">user2</span> Loved it! ❤️
            </p>
          </div>
        </div>
        <div className="mt-4">
          <textarea
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Add a comment..."
          ></textarea>
          <button className="mt-2 w-full py-2 bg-blue-600 rounded text-white">
            Post
          </button>
        </div>
      </Drawer>
    </React.Fragment>
  );
};

export default TikTokFixedVideo;
