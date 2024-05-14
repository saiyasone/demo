import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";
import Instagram from "@uppy/instagram";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";

import "@uppy/core/dist/style.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";

function UppyPackage() {
  const companionUrl = "https://companion.uppy.io";
  const [uppyInstance, setUppyInstance] = useState(() => new Uppy());
  useEffect(() => {
    const uppy = new Uppy({
      id: "upload-file-id",
      restrictions: {},
      autoProceed: true,
    })
      .use(Webcam)
      .use(GoogleDrive, {
        companionUrl,
      })
      .use(Dropbox, {
        companionUrl,
        title: "Dropbox",
      })
      .use(Instagram, {
        companionUrl,
      })
      .use(Url, {
        companionUrl,
      })
      .on("file-added", (files) => {
        console.log("File added:", files.data);
      })
      .on("upload", () => {
        console.log("Uploading...");
      });
    //   .use(Tus, {
    //     endpoint: "https://load.vshare.net/upload",
    //     "Content-Type": "multipart/form-data",
    //   });

    setUppyInstance(uppy);
    return () => {
      uppy.close();
    };
  }, []);

  return (
    <Box sx={{ my: 4, mx: 4 }}>
      <Typography variant="h5" mb={4}>
        UppyPackage
      </Typography>
      {uppyInstance && (
        <Fragment>
          <Dashboard
            uppy={uppyInstance}
            showProgressDetails={true}
            plugins={["Webcam", "GoogleDrive", "Dropbox", "Instagram", "Url"]}
          />
        </Fragment>
      )}
    </Box>
  );
}

export default UppyPackage;
