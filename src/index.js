import React from "react";
import ReactDOM from "react-dom/client";
// import {} from "react-router-dom"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RouterProvider } from "react-router-dom";
import routers from "./routes";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';

const client = new ApolloClient({
  uri: "https://dev.vshare.net/graphql",
  cache: new InMemoryCache(),
  headers: {
    sabaiydevdevelopment: "jjljlfkjwelfj,lwe.jlwjrlhwek-Akj5-jksdjflj",
    Authorization:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOjExNCwicHJvZmlsZSI6IlUyTnlaV1Z1YzJodmRDQXlNREl6TFRBM0xUSTBJREUxTVRReE9ETXhMVEV3TFRJd01qTS5wbmciLCJmaXJzdE5hbWUiOiJkZW1vIiwibGFzdE5hbWUiOiJsYXN0IiwibmV3TmFtZSI6IjY3MjI1NDI4OTk2OTIiLCJlbWFpbCI6InNhaXlhc29uZTU5NUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImRlbW8xIiwiaXAiOm51bGwsInN0YXR1cyI6ImFjdGl2ZSIsImlhdCI6MTY5ODk4MzA5NywiZXhwIjoxNzAxNTc1MDk3fQ.ec7JbgjKuhY8oSEWPVqaygH4S2K5n5TxxCdkaVLOq1I",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={routers}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </RouterProvider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
