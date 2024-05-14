import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CryptoJS from "crypto-js";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";
import Tus from "@uppy/tus";
import xhrUpload from "@uppy/xhr-upload"
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
    const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
    const headers = {
      REGION: "sg",
      BASE_HOSTNAME: "storage.bunnycdn.com",
      STORAGE_ZONE_NAME: "beta-vshare",
      ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
      PATH: "6722542899692-114",
      FILENAME: "114.png",
      PATH_FOR_THUMBNAIL: "6722542899692-114",
    };
    const encryptedHeaders = CryptoJS.AES.encrypt(
      JSON.stringify(headers),
      secretKey
    ).toString();

    const uppy = new Uppy({
      id: "upload-file-id",
      restrictions: {},
      autoProceed: false,
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
        // console.log("File added:", files.data);
      })
      .use(xhrUpload, {
        endpoint: "https://load.vshare.net/upload",
        headers: {
          "Content-Type": "multipart/form-data",
          encryptedHeaders,
        },
      });

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
