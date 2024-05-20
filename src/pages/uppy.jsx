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
import ScreenCapture from "@uppy/screen-capture";
import FileInput from "@uppy/file-input";
import xhrUpload from "@uppy/xhr-upload";
import Instagram from "@uppy/instagram";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import AudioFile from "@uppy/audio";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.css";

function UppyPackage() {
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const companionUrl = "https://companion.uppy.io";
  const [uppyInstance, setUppyInstance] = useState(() => new Uppy());

  async function fetchRandomData() {
    const randomName = Math.floor(1111111 + Math.random() * 9999999);
    return randomName;
  }

  async function handleUpload() {
    if (!uppyInstance.getFiles().length) return;

    try {
      const formData = new FormData();
      const dataFile = uppyInstance.getFiles();

      await dataFile.map(async (file) => {
        const blob = new Blob([file], {
          type: file.type,
        });
        const newFile = new File([blob], file.name, { type: file.type });
        formData.append("file", newFile);
        await uppyInstance.upload();

        // const extension = file?.name?.lastIndexOf(".");
        // const fileExtension = file.name?.slice(extension);

        // if (uppyInstance) {
        //   const blob = new Blob([file], {
        //     type: file.type,
        //   });
        //   const newFile = new File([blob], file.name, { type: file.type });
        //   formData.append("file", newFile);
        //   await uppyInstance.upload();
        //   let result = await uploadFileAction({
        //     variables: {
        //       data: {
        //         newFilename: `${file.data?.customeNewName}${fileExtension}`,
        //         filename: file.name,
        //         fileType: file.type,
        //         size: file.size.toString(),
        //         checkFile: "main",
        //         country: null,
        //         device: "Windows10",
        //         totalUploadFile: dataFile.length,
        //       },
        //     },
        //   });
        //   if (result.data?.createFiles?._id) {
        //     const blob = new Blob([file], {
        //       type: file.type,
        //     });
        //     const newFile = new File([blob], file.name, { type: file.type });
        //     formData.append("file", newFile);
        //     await uppyInstance.upload();
        //   }
        // }
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  function handleAddmore() {}

  useEffect(() => {
    const initializeUppy = () => {
      try {
        const uppy = new Uppy({
          id: "upload-file-id",
          restrictions: {},
          autoProceed: false,
          allowMultipleUploadBatches: true,
        });
        uppy.use(Webcam);
        uppy.use(Tus, {
          endpoint: "https://load.vshare.net/upload",
          headers: (file) => {
            const extension = file?.name?.lastIndexOf(".");
            const fileExtension = file.name?.slice(extension);

            const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
            const headers = {
              REGION: "sg",
              BASE_HOSTNAME: "storage.bunnycdn.com",
              STORAGE_ZONE_NAME: "beta-vshare",
              ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
              PATH: "6722542899692-114",
              FILENAME: `${file.data?.customeNewName}${fileExtension}`,
              PATH_FOR_THUMBNAIL: "6722542899692-114",
            };
            const encryptedHeaders = CryptoJS.AES.encrypt(
              JSON.stringify(headers),
              secretKey
            ).toString();

            return {
              // "Content-Type": "multipart/form-data",
              encryptedHeaders,
            };
          },
        });
        uppy.use(ThumbnailGenerator, {
          thumbnailWidth: 200,
          thumbnailHeight: 200,
        });
        uppy.use(FileInput, {});
        uppy.use(GoogleDrive, {
          companionUrl,
        });

        uppy.use(ScreenCapture, {});
        uppy.use(AudioFile, {});
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
        // uppy.use(Transloadit, {
        //   assemblyOptions: {
        //     params: {
        //       auth: { key: "0389d1669c0f4ec6b644e9ae324059f5" },
        //       template_id: "7ec663a55ab649e780153b4fb8d0660b",
        //     },
        //   },
        // });

        uppy.use(Url, {
          companionUrl,
        });
        // uppy.use(xhrUpload, {
        //   endpoint: "https://load.vshare.net/upload",
        //   formData: true,
        //   method: "POST",
        //   fieldName: "file",
        //   headers: (file) => {
        //     const extension = file?.name?.lastIndexOf(".");
        //     const fileExtension = file.name?.slice(extension);

        //     const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
        //     const headers = {
        //       REGION: "sg",
        //       BASE_HOSTNAME: "storage.bunnycdn.com",
        //       STORAGE_ZONE_NAME: "beta-vshare",
        //       ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
        //       PATH: "6722542899692-114",
        //       FILENAME: `${file.data?.customeNewName}${fileExtension}`,
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

        uppy.on("file-added", (file) => {
          try {
            fetchRandomData().then((data) => {
              file.data.customeNewName = data;
            });
          } catch (error) {}
        });
        uppy.on("file-removed", () => {});
        uppy.on("complete", () => {});

        setUppyInstance(uppy);
        return () => {
          uppy.close();
        };
      } catch (error) {}
    };

    initializeUppy();
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
          <Button onClick={handleAddmore} variant="contained">
            Add more
          </Button>
        </Box>
        {uppyInstance && (
          <Fragment>
            <Dashboard
              uppy={uppyInstance}
              width={`${100}%`}
              showProgressDetails={true}
              locale={{
                strings: {
                  addMore: "Add nigga",
                  cancel: "Cancel nigga",
                  dropPaste: "Hello files",
                  browse: "browse",
                },
              }}
              plugins={[
                "Webcam",
                "GoogleDrive",
                "Dropbox",
                "Instagram",
                "Url",
                "PauseResumeButton",
              ]}
              hideUploadButton={true}
              proudlyDisplayPoweredByUppy={false}
            />
          </Fragment>
        )}
      </Box>
    </Fragment>
  );
}

export default UppyPackage;
