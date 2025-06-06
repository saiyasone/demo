import { useMemo, useState } from "react";
import { Typography, Box, Button as ButtonBase } from "@mui/material";
import { motion } from "framer-motion";
import { AppContainer } from "../components/Container";
import AppInput from "../components/TextField";
import Card from "../components/Card";
import Button from "../components/button";
import Header from "../components/layouts/header/index";
import { AppMediaQuery } from "../components/useMediaQuery";

// use In view animation to load animation
import { mapAnimation } from "../animation/index";
import { useInView } from "react-intersection-observer";

import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import FeedSliderPreview from "../components/PreviewFileSlide";
import TikTokShort from "./tiktok";
import { Filter } from "bad-words";

function Home() {
  const [toggle, setToggle] = useState(false);
  const [currentData, setCurrentData] = useState("main");
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const filter = new Filter();

  async function handleEvent() {
    setToggle((val) => (val = !val));
  }

  const sanitizeText = (text) => {
    return filter.clean(text);
  };

  // Usage
  const userInput = "mother fucker";
  const cleanText = useMemo(() => sanitizeText(userInput), []);
  console.log(cleanText)

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Callback when the PDF file is successfully loaded
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // use Animation
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  function handleCurrentData(currentData) {
    setCurrentData(currentData);
  }

  return (
    <div className="App">
      <Header />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        <ButtonBase
          onClick={() => handleCurrentData("main")}
          variant="contained"
        >
          Main
        </ButtonBase>
        <ButtonBase
          onClick={() => handleCurrentData("pdf")}
          variant="contained"
        >
          Pdf file
        </ButtonBase>
      </Box>

      <Box sx={{ px: 5 }}>{/* <TikTokShort /> */}</Box>

      {currentData === "main" && (
        <>
          <Box padding="1rem 0">
            <Button onClick={handleEvent}></Button>
            <Box paddingTop="12px">
              <Typography component="p">
                Start a new project &copy; Only Devs
              </Typography>
            </Box>
          </Box>
          {/* Container */}
          <AppContainer>
            <Typography variant="h4" mb={2}>
              Start with a container
            </Typography>
            <AppInput placeholder="Input Example" />

            <Box ref={ref1}>
              <motion.h3
                variants={mapAnimation}
                initial="hidden"
                animate={inView1 ? "show" : "hidden"}
              >
                <Box marginBottom="1rem">
                  <Card>
                    <Box padding="1rem 2rem">
                      <Typography variant="h4">Naruto</Typography>
                    </Box>
                  </Card>
                </Box>
                <Box>
                  <AppMediaQuery />
                </Box>
              </motion.h3>
            </Box>
          </AppContainer>
        </>
      )}

      {currentData === "pdf" && (
        <div>
          <input type="file" onChange={onFileChange} accept="application/pdf" />
          <div>
            {file && (
              <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} />
                ))}
              </Document>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
