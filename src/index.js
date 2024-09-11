import React, { Fragment } from "react";
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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
