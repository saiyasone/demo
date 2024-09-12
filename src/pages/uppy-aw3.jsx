import React, { Fragment, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { gql, useMutation } from "@apollo/client";
import { UPLOAD_FILE } from "../apollo/upload";

import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Header from "../components/layouts/header";
import Webcam from "@uppy/webcam";
import ImageEditor from "@uppy/image-editor";
import AudioFile from "@uppy/audio";
import ThumbnailGenerator from "@uppy/thumbnail-generator";

import "@uppy/core/dist/style.min.css";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@uppy/image-editor/dist/style.css";
import "@uppy/audio/dist/style.min.css";

import {
  ButtonActionContainer,
  ButtonCancelAction,
  ButtonUploadAction,
  UploadFilesContainer,
} from "../styles/upload-style";
import { encryptData } from "../utils/secure";
import { getFileNameExtension } from "../utils/file.util";
import AwsS3Multipart from "@uppy/aws-s3";

const MUTATION_CREATE_FILE = gql`
  mutation CreateFiles($data: FilesInput!) {
    createFiles(data: $data) {
      _id
      path
    }
  }
`;

function UppyPackageAw3() {
  const companionUrl = "https://companion.uppy.io";
  const newPath = "059d6c72-0da6-430a-8829-6d73cc04a725";
  const endpoints = "https://coding.load.vshare.net";
  const [canClose, setCanClose] = useState(false);

  const [uploadFiles] = useMutation(MUTATION_CREATE_FILE);

  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : "";
  const [uppyInstance, setUppyInstance] = useState(() => new Uppy());

  async function fetchRandomData() {
    const randomName = Math.floor(111111111 + Math.random() * 999999999);
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
    const selectFiles = await uppyInstance.getFiles();
    if (selectFiles.length < 0) {
      return;
    }

    try {
      setCanClose(true);
      await uppyInstance.upload();
    } catch (error) {
      console.log(error);
    }
  }

  function handleResetUpload() {
    setCanClose(false);
    handleDone();
  }

  function handleDone() {
    const files = uppyInstance.getFiles();

    files.forEach((file) => {
      uppyInstance.removeFile(file.id);
    });

    const dashboard = uppyInstance.getPlugin("Dashboard");
    if (dashboard) {
      dashboard.hide();
    }
  }

  useEffect(() => {
    const initializeUppy = () => {
      try {
        const uppy = new Uppy({
          id: "upload-file-id",
          restrictions: {
            maxNumberOfFiles: userData?.packageId?.numberOfFileUpload || 10,
          },
          autoProceed: false,
          allowMultipleUploadBatches: true,
        });

        uppy.on("file-added", async (file) => {
          try {
            const newFilename = await fetchRandomData();
            file.data.newFilename =
              newFilename + getFileNameExtension(file.name);
          } catch (error) {}
        });
        uppy.on("file-removed", (file) => {
          console.log("first", file);
        });
        uppy.on("complete", () => {
          setCanClose(false);
          uppy.clearUploadedFiles()
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

        uppy.use(AwsS3Multipart, {
          abortMultipartUpload: true,
          limit: 4,
          shouldUseMultipart: true,

          async createMultipartUpload(file) {
            const uploading = await uploadFiles({
              variables: {
                data: {
                  destination: "",
                  newFilename: file.data.newFilename,
                  filename: file.name,
                  fileType: file.data.type,
                  size: file.size.toString(),
                  checkFile: "sub",
                  country: "india",
                  device: "pc",
                  totalUploadFile: uppy.getFiles().length,
                  newPath: `${newPath}/${file.data.newFilename}`,
                  folder_id: "169",
                },
              },
            });

            const fileId = await uploading.data?.createFiles?._id;
            if (fileId) {
              const headers = {
                createdBy: userData?._id,
                FILENAME: file.data.newFilename,
                PATH: `${userData?.newName}-${userData?._id}/${newPath}`,
              };
              const _encryptHeader = await encryptData(headers);

              return fetch(`${endpoints}/initiate-multipart-upload`, {
                method: "POST",
                headers: {
                  encryptedheaders: _encryptHeader,
                },
              })
                .then((response) => response.json())
                .then((data) => ({
                  uploadId: data.uploadId,
                  key: data.key,
                }));
            }
          },
          async signPart(file, { uploadId, key, partNumber }) {
            const headers = {
              createdBy: userData?._id,
              FILENAME: file.data.newFilename,
              PATH: `${userData?.newName}-${userData?._id}/${newPath}`,
            };

            const _encryptHeader = await encryptData(headers);

            const formData = new FormData();
            formData.append("partNumber", partNumber.toString());
            formData.append("uploadId", uploadId);
            formData.append("FILENAME", file.data.newFilename);

            return fetch(`${endpoints}/generate-presigned-url`, {
              method: "POST",
              body: formData,
              headers: {
                encryptedheaders: _encryptHeader,
              },
            })
              .then((response) => response.json())
              .then((data) => ({
                url: data.url,
              }));
          },
          async completeMultipartUpload(file, { uploadId, key, parts }) {
            const headers = {
              createdBy: userData?._id,
              FILENAME: file.data.newFilename,
              PATH: `${userData?.newName}-${userData?._id}/${newPath}`,
            };
            const _encryptHeader = await encryptData(headers);

            const formData = new FormData();
            formData.append("parts", JSON.stringify(parts));
            formData.append("uploadId", uploadId);
            formData.append("FILENAME", file.data.newFileName);

            return fetch(`${endpoints}/complete-multipart-upload`, {
              method: "POST",
              body: formData,
              headers: {
                encryptedheaders: _encryptHeader,
              },
            }).then((response) => response.json());
          },
        });

        setUppyInstance(uppy);
        return () => {
          uppy.close();
        };
      } catch (error) {}
    };

    console.log(userData?.packageId);
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
                  onClick={
                    canClose
                      ? () => {
                          console.log("you can't be closed");
                        }
                      : handleResetUpload
                  }
                >
                  Cancel
                </ButtonCancelAction>
                <ButtonUploadAction
                  onClick={() => {
                    if (!canClose) {
                      console.log("uploading files ...");
                      handleUploadV1();
                    }
                  }}
                >
                  {canClose ? "Uploading ..." : "Upload"}
                </ButtonUploadAction>
              </ButtonActionContainer>
            </Fragment>
          )}
        </UploadFilesContainer>
      </Box>
    </Fragment>
  );
}

export default UppyPackageAw3;
