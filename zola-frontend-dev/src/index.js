import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

import reportWebVitals from "./reportWebVitals";

import { GlobalProvider } from "./contexts/GlobalContext";
import { SocketProvider } from "./contexts/SocketContext";
import Router from "./pages";
import { theme } from "./libs";

import "./assets/styles/global.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <GlobalProvider>
        <SocketProvider>
          <Router />
        </SocketProvider>
      </GlobalProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
