import Button from "./components/button";
import { Typography } from "@mui/material";
import { AppContainer } from "./components/Container";
import "./App.css";

function App() {
  function handleEvent() {
    console.log("handle");
  }
  return (
    <div className="App">
      {/* Button */}
      <Button onClick={handleEvent}></Button>
      <Typography component="p">Start a new project. Heading</Typography>
      {/* Container */}
      <AppContainer maxWidth="lg, sm" fixed>
        <Typography variant="h4">Start with a container</Typography>
      </AppContainer>
    </div>
  );
}

export default App;
