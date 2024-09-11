import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "../apollo/upload";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Header from "../components/layouts/header";

// import Dropbox from "@uppy/dropbox";
// import ScreenCapture from "@uppy/screen-capture";
// import FileInput from "@uppy/file-input";
import xhrUpload from "@uppy/xhr-upload";
// import Instagram from "@uppy/instagram";
import Url from "@uppy/url";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import AudioFile from "@uppy/audio";
import ThumbnailGenerator from "@uppy/thumbnail-generator";
// import Tus from "@uppy/tus";
// import AwsS3Multipart from "@uppy/aws-s3-multipart";

import "@uppy/core/dist/style.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.css";
import {
  ButtonActionContainer,
  ButtonCancelAction,
  ButtonUploadAction,
  UploadFilesContainer,
} from "../styles/upload-style";
import { ENV_FILE } from "../utils/env";
import { encryptData } from "../utils/secure";

function UppyPackage() {
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const companionUrl = "https://companion.uppy.io";
  const newPath = "059d6c72-0da6-430a-8829-6d73cc04a725";
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : "";
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

        const extension = file?.name?.lastIndexOf(".");
        const fileExtension = file.name?.slice(extension);

        if (uppyInstance) {
          const result = await uploadFileAction({
            variables: {
              data: {
                newFilename: `${file.data?.customeNewName}${fileExtension}`,
                filename: file.name,
                fileType: file.type,
                size: file.size.toString(),
                checkFile: "sub",
                country: null,
                device: "Windows10",
                totalUploadFile: dataFile.length,
                folder_id: "169",
                newPath,
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

  async function handleUploadV1() {
    try {
      await uppyInstance.upload();
    } catch (error) {
      console.log(error);
    }
  }

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

        uppy.use(ThumbnailGenerator, {
          thumbnailWidth: 200,
          thumbnailHeight: 200,
        });

        uppy.use(AudioFile, {
          showAudioSourceDropdown: true,
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

        uppy.use(Url, {
          companionUrl,
        });

        uppy.use(xhrUpload, {
          endpoint: ENV_FILE.REACT_APP_LOAD_UPLOAD_URL,
          formData: true,
          method: "POST",
          fieldName: "file",

          headers: (file) => {
            const extension = file?.name?.lastIndexOf(".");
            const fileExtension = file.name?.slice(extension);

            const headers = {
              PATH: `${userData?.newName}-${userData?._id}/${newPath}`,
              FILENAME: `${file.data?.customeNewName}${fileExtension}`,
              createdBy: userData?._id,
            };

            const encryptedData = encryptData(headers);

            return {
              encryptedHeaders: encryptedData,
            };
          },
        });

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
        <UploadFilesContainer>
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Typography variant="h5">UppyPackage</Typography>
          </Box>
          {uppyInstance && (
            <Fragment>
              <Dashboard
                uppy={uppyInstance}
                width={`${100}%`}
                showProgressDetails={true}
                locale={{
                  strings: {
                    addMore: "Add more",
                    cancel: "Cancel",
                    dropPaste: "Hello files",
                    browse: "browse",
                    browseFiles: "browse files",
                    dropHint: "Drop your files here",
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

              <ButtonActionContainer>
                <ButtonCancelAction
                  onClick={() => {
                    // uppyInstance.getPlugin("Dashboard").closeModal();
                  }}
                >
                  Cancel
                </ButtonCancelAction>
                <ButtonUploadAction onClick={handleUploadV1}>
                  Upload now
                </ButtonUploadAction>
              </ButtonActionContainer>
            </Fragment>
          )}
        </UploadFilesContainer>
      </Box>
    </Fragment>
  );
}

export default UppyPackage;
