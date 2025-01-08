import { useMediaQuery } from "@mui/material";
import React from "react";
import { FaBookmark, FaCommentDots, FaHeart } from "react-icons/fa";

function FeedActionV1(props) {
  const isMobile = useMediaQuery("(max-width: 650px)");
  return (
    <React.Fragment>
      {!isMobile && (
        <div className="ml-4 flex items-end">
          <div className="mr-6 flex flex-col items-center space-y-4 mb-2">
            <div className="flex gap-4 flex-col items-center">
              <button
                className={`p-3 bg-gray-200 rounded-full ${
                  props.tablet ? "text-4xl" : "text-lg"
                }`}
                onClick={props.handleNavigateTop}
              >
                <FaHeart />
              </button>
              <button
                className={`p-3 bg-gray-200 rounded-full ${
                  props.tablet ? "text-4xl" : "text-lg"
                }`}
                onClick={props.handleNavigateDown}
              >
                <FaCommentDots />
              </button>
              <button
                className={`p-3 bg-gray-200 rounded-full ${
                  props.tablet ? "text-4xl" : "text-lg"
                }`}
                onClick={() => props.togglePlayPause}
              >
                <FaBookmark />
              </button>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default FeedActionV1;
