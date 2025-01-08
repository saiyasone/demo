import React from "react";
import { FaBookmark, FaCommentDots, FaHeart } from "react-icons/fa";

function FeedAction(props) {
  return (
    <div className="absolute right-0 mr-6 bottom-4 flex flex-col items-center space-y-4 mb-8">
      <div className="flex gap-4 flex-col items-center">
        <button
          className={`p-3 bg-gray-800 rounded-full ${
            props.tablet ? "text-4xl" : "text-lg"
          }`}
          onClick={props.handleNavigateTop}
        >
          <FaHeart />
        </button>
        <button
          className={`p-3 bg-gray-800 rounded-full ${
            props.tablet ? "text-4xl" : "text-lg"
          }`}
          onClick={props.handleNavigateDown}
        >
          <FaCommentDots />
        </button>
        <button
          className={`p-3 bg-gray-800 rounded-full ${
            props.tablet ? "text-4xl" : "text-lg"
          }`}
          onClick={() => props.togglePlayPause}
        >
          <FaBookmark />
        </button>
      </div>
    </div>
  );
}

export default FeedAction;
