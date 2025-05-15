import { useEffect, useState } from "react";
import Header from "../components/layouts/header";
import { Box, Button } from "@mui/material";
import Scale from "../components/aimations/scale";
import Circle360 from "../components/aimations/circle360";
import FadeSlideIn from "../components/aimations/fadeSlideIn";
import Lorem from "../components/texts/lorem";
import FadeIn from "../components/aimations/fadeIn";
import { TypingWithCursor } from "../components/aimations/textTyping";

function AnimationPage() {
  const [isVisible, setIsVisible] = useState(false);
  const Array2D = [
    [1, 2, 3, 4],
    [11, 22, 33, 44],
    [111, 222, 333, 444],
  ];

  useEffect(() => {
    for (let i = 0; i < Array2D.length; i++) {
      for (let j = 0; j < Array2D[i].length; j++) {
        console.log("j", j);
      }
      console.log(console.log("i", Array2D[i]));
    }
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Header />
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" onClick={() => setIsVisible(!isVisible)}>
          toggle
        </Button>
      </Box>
      <TypingWithCursor />
      {/* <Scale isVisible={isVisible} />
      <Circle360 isVisible={isVisible} /> */}
      {/* <Lorem /> */}
      {/* <FadeSlideIn direction="left">
        <div className="p-6 bg-blue-200 rounded">From Left</div>
      </FadeSlideIn>
      <FadeSlideIn direction="right">
        <div className="p-6 bg-green-200 rounded">From Right</div>
      </FadeSlideIn> */}
      {/* <FadeSlideIn direction="bottom">
        <div className="p-6 bg-purple-200 rounded">From Bottom</div>
      </FadeSlideIn> */}
      {/* <FadeIn>
        <div className="p-6 bg-purple-200 rounded">From Bottom</div>
      </FadeIn> */}
    </Box>
  );
}

export default AnimationPage;
