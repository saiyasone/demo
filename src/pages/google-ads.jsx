import React, { Fragment } from "react";
import "../styles/uppy-manual.css";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/layouts/header";
import GoogleAds from "../components/googleAds";

function UppyManual() {
  return (
    <Fragment>
      <Header />

      <GoogleAds />
    </Fragment>
  );
}

export default UppyManual;
