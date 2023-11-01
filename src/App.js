import { useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  from,
  useLazyQuery,
} from "@apollo/client";
import Button from "./components/button";
import { motion } from "framer-motion";
import { Typography, Box } from "@mui/material";
import { AppContainer } from "./components/Container";
import AppInput from "./components/TextField";
import Card from "./components/Card";
import { AppMediaQuery } from "./components/useMediaQuery";
// use In view animation to load animation
import { mapAnimation } from "./animation";
import { useInView } from "react-intersection-observer";
import LoginProvider from "./pages/login";
import "./App.css";
import Contact from "./pages/contact";

function App() {
  const [toggle, setToggle] = useState(false);

  async function handleEvent() {
    setToggle((val) => (val = !val));
  }

  const client = new ApolloClient({
    uri: "https://dev.vshare.net/graphql",
    cache: new InMemoryCache(),
    headers: {
      sabaiydevdevelopment: "jjljlfkjwelfj,lwe.jlwjrlhwek-Akj5-jksdjflj",
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjExNCwicHJvZmlsZSI6IlUyTnlaV1Z1YzJodmRDQXlNREl6TFRBM0xUSTBJREUxTVRReE9ETXhMVEV3TFRJd01qTS5wbmciLCJmaXJzdE5hbWUiOiJkZW1vIiwibGFzdE5hbWUiOiJsYXN0IiwibmV3TmFtZSI6IjY3MjI1NDI4OTk2OTIiLCJlbWFpbCI6InNhaXlhc29uZTU5NUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRlbW8xIiwiaXAiOm51bGwsInN0YXR1cyI6ImFjdGl2ZSIsImlhdCI6MTY5ODgyMTk1NSwiZXhwIjoxNzAxNDEzOTU1fQ.82j5H2p_OOYvy5dn47_RilEmLiZ-N6rCK8q4TQ6mJEQ",
    },
  });

  // use Animation
  const { ref: ref1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="App">
      <ApolloProvider client={client}>
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

              <Box marginTop="1rem">
                {/* <LoginProvider/> */}
                <Contact/>
              </Box>
            </motion.h3>
          </Box>
        </AppContainer>
        {/* Button */}
      </ApolloProvider>
    </div>
  );
}

export default App;
