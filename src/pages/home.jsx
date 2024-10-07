import { useState } from "react";
import { Typography, Box } from "@mui/material";
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

function Home() {
  const [toggle, setToggle] = useState(false);
  // const webSocket = new WebSocket("wss://localhost:8080");

  async function handleEvent() {
    setToggle((val) => (val = !val));
  }

  // use Animation
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="App">
      <Header />
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
      {/* Button */}
    </div>
  );
}

export default Home;
