import React, { Fragment, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "../apollo/upload";
import CryptoJS from "crypto-js";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Header from "../components/layouts/header";
import GoogleDrive from "@uppy/google-drive";
import Dropbox from "@uppy/dropbox";

import xhrUpload from "@uppy/xhr-upload";
import Tus from "@uppy/tus";
import Instagram from "@uppy/instagram";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";

import "@uppy/core/dist/style.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.css";

function UppyPackage() {
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const companionUrl = "https://companion.uppy.io";
  const [uppyInstance, setUppyInstance] = useState(() => new Uppy());

  async function handleUpload() {
    if (!uppyInstance.getFiles().length) return;

    try {
      const formData = new FormData();
      const dataFile = uppyInstance.getFiles();

      await dataFile.map(async (file) => {
        const randomName = Math.floor(1111111 + Math.random() * 9999999);
        const extension = file?.name?.lastIndexOf(".");
        const fileExtension = file.name?.slice(extension);
        if (uppyInstance) {
          let result = await uploadFileAction({
            variables: {
              data: {
                newFilename: `${randomName}.${fileExtension}`,
                filename: file.name,
                fileType: file.type,
                size: file.size.toString(),
                checkFile: "main",
                country: null,
                device: "Windows10",
                totalUploadFile: dataFile.length,
              },
            },
          });

          if (result.data?.createFiles?._id) {
            const blob = new Blob([file], {
              type: file.type,
            });

            const newFile = new File([blob], file.name, { type: file.type });
            formData.append("file", newFile);

            await uppyInstance.upload();
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const uppy = new Uppy({
      id: "upload-file-id",
      restrictions: {},
      autoProceed: false,
    });
    uppy.use(Webcam);
    uppy.use(GoogleDrive, {
      companionUrl,
    });
    uppy.use(ImageEditor, {
      quality: 0.7,
      cropperOptions: {
        viewMode: 1,
        background: false,
        center: true,
        responsive: true,
      },
    });
    uppy.use(Dropbox, {
      companionUrl,
      title: "Dropbox",
    });
    uppy.use(Instagram, {
      companionUrl,
    });
    uppy.use(Tus, {
      endpoint: "https://load.vshare.net/upload",
    });

    uppy.use(Url, {
      companionUrl,
    });
    // uppy.use(xhrUpload, {
    //   endpoint: "https://load.vshare.net/upload",
    //   formData: true,
    //   method: "POST",
    //   fieldName: "file",

    //   headers: (file) => {
    //     const randomName = Math.floor(1111111 + Math.random() * 9999999);
    //     const extension = file?.name?.lastIndexOf(".");
    //     const fileExtension = file.name?.slice(extension);

    //     const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
    //     const headers = {
    //       REGION: "sg",
    //       BASE_HOSTNAME: "storage.bunnycdn.com",
    //       STORAGE_ZONE_NAME: "beta-vshare",
    //       ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
    //       PATH: "6722542899692-114",
    //       FILENAME: `${randomName}.${fileExtension}`,
    //       PATH_FOR_THUMBNAIL: "6722542899692-114",
    //     };
    //     const encryptedHeaders = CryptoJS.AES.encrypt(
    //       JSON.stringify(headers),
    //       secretKey
    //     ).toString();

    //     return {
    //       // "Content-Type": "multipart/form-data",
    //       encryptedHeaders,
    //     };
    //   },
    // });
    uppy.on("file-added", () => {});
    uppy.on("file-removed", () => {});
    uppy.once("complete", () => {});

    setUppyInstance(uppy);
    return () => {
      uppy.close();
    };
  }, []);

  return (
    <Fragment>
      <Header />

      <Box sx={{ my: 4, mx: 4 }}>
        <Box mb={4} sx={{ display: "flex", gap: "1rem" }}>
          <Typography variant="h5">UppyPackage</Typography>

          <Button onClick={handleUpload} variant="contained">
            Upload
          </Button>
        </Box>
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
    </Fragment>
  );
}

export default UppyPackage;
