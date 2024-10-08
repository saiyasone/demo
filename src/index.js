import React from "react";
import ReactDOM from "react-dom/client";
// import {} from "react-router-dom"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import routers from "./routes";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "./constants/muiTheme";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// import { pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.mjs",
//   import.meta.url
// ).toString();

const token = localStorage.getItem("token");
const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  cache: new InMemoryCache(),
  headers: {
    sabaiydevdevelopment: "jjljlfkjwelfj,lwe.jlwjrlhwek-Akj5-jksdjflj",
    authorization: token,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={routers}>
      <React.StrictMode>
        <ThemeProvider theme={muiTheme}>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </RouterProvider>
  </ApolloProvider>
);
reportWebVitals();
