import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import CryptoJS from "crypto-js";
import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { FaTimesCircle, FaPlus, FaCheckCircle } from "react-icons/fa";
import Header from "../components/layouts/header";
import { UPLOAD_FILE } from "../apollo/upload";
import { gql, useMutation } from "@apollo/client";
import { Uppy } from "@uppy/core";
import { DragDrop } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { ReactComponent as IconMyfolerFull } from "./../images/FolderIcon.svg";
import * as MUI from "../styles/upload-style";
import { useDropzone } from "react-dropzone";
import FolderIcon from "../images/FolderIcon.png";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";

const MyfolderFull = () => {
  return <IconMyfolerFull />;
};

function UploadFile() {
  const folderRef = useRef();
  const [fileData, setFileData] = useState([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [folderData, setFolderData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uppyInstance, setUppyInstance] = useState(new Uppy());

  // Graphql
  const UPLOAD_FOLDER = gql`
    mutation UploadFolder($data: UploadFolderInput!) {
      uploadFolder(data: $data) {
        _id
        status
        path {
          newPath
          path
        }
      }
    }
  `;
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const [uploadFolderAction] = useMutation(UPLOAD_FOLDER);

  const onDrop = useCallback((acceptedFiles) => {
    const folderNames = new Set();
    const folders = [];

    let newUploadProgress = {};
    let newFolders = [];
    let updateFolders = [];

    acceptedFiles.forEach((file) => {
      const pathSegments = file.path?.split("/")[1];
      if (pathSegments.length > 1) {
        folderNames.add(pathSegments);
      }

      folders.push({
        file,
        webkitRelativePath: pathSegments,
      });

      newUploadProgress = { ...uploadProgress };
      newFolders = [...folders];
      updateFolders = [...folderData, ...newFolders];
      updateFolders.forEach((_, index) => {
        if (!(index in newUploadProgress)) {
          newUploadProgress[index] = 0;
        }
      });
    });

    setFolderData((prev) => [...prev, ...updateFolders]);
    setUploadProgress(newUploadProgress);

    // setFolderData((prev) => {
    //   return [...prev, ...folders];
    // });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function handleFile(event) {
    const { files } = event.target;
    setFileData(Array.from(files));
  }

  function handleFolder(evt) {
    const { files } = evt.target;
    const newUploadProgress = { ...uploadProgress };
    const folders = Array.from(files)
      .filter((file) => String(file.webkitRelativePath).includes("/"))
      .map((file) => ({
        file,
        webkitRelativePath: file.webkitRelativePath,
      }));

    const newFolders = [...folders];
    const updateFolders = [...folderData, ...newFolders];
    updateFolders.forEach((_, index) => {
      if (!(index in newUploadProgress)) {
        newUploadProgress[index] = 0;
      }
    });

    setFolderData(updateFolders);
    setUploadProgress(newUploadProgress);
    // setFolderData((prev) => {
    //   return [...prev, ...folders];
    // });
  }

  function lengthOfFolder() {
    return [
      ...new Set(
        folderData.map(
          (folder) => String(folder.webkitRelativePath).split("/")[0]
        )
      ),
    ].length;
  }

  async function handleUpload() {
    if (!fileData.length) {
      return;
    }

    try {
      fileData.map(async (file) => {
        const randomName = Math.floor(1111111 + Math.random() * 9999999);
        const fileExtension = file?.name?.split(".")[1];

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
              totalUploadFile: fileData.length,
            },
          },
        });

        if (result.data?.createFiles?._id) {
          const secretKey = "jsje3j3,02.3j2jk=243j42lj34hj23l24l;2h5345l";
          const headers = {
            REGION: "sg",
            BASE_HOSTNAME: "storage.bunnycdn.com",
            STORAGE_ZONE_NAME: "beta-vshare",
            ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
            PATH: "6722542899692-114",
            FILENAME: `${randomName}.${fileExtension}`,
            PATH_FOR_THUMBNAIL: "6722542899692-114",
          };
          const encryptedHeaders = CryptoJS.AES.encrypt(
            JSON.stringify(headers),
            secretKey
          ).toString();

          const blob = new Blob([file], {
            type: file.type,
          });
          const newFile = new File([blob], file.name, { type: file.type });
          const formData = new FormData();
          formData.append("file", newFile);

          const response = await axios.post(
            `https://load.vshare.net/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                encryptedHeaders,
              },
            }
          );
          const data = await response.data;
          console.log(data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleFolderTrigger() {
    folderRef.current.click();
  }

  function removeFolder(folderName) {
    setFolderData((prev) =>
      prev.filter((folder) => {
        return folder.webkitRelativePath.split("/")[0] !== folderName;
      })
    );
  }

  async function uploadFolder() {
    try {
      if (folderData.length > 0) {
        for (let i = 0; i < folderData.length; i++) {
          const newUploadProgress = {};
          newUploadProgress[i] = 0;
          setUploadProgress(newUploadProgress);
        }

        await handleUploadFolder();
        // [
        //   ...new Set(
        //     folderData.map((folder) => folder.webkitRelativePath.split("/")[0])
        //   ),
        // ].map(async (folder) => {
        //   const response = await axios.post(
        //     `http://192.168.100.49:4002/api/folders`,
        //     {
        //       folderName: folder,
        //     }
        //   );

        //   const resData = await response.data;
        //   console.log(resData);
        // });
      }
      // [
    } catch (error) {}
  }

  async function handleUploadFolder() {
    let uploadedSize = 0;
    let currentUploadPercentage = 0;
    const totalSize = folderData.reduce((acc, file) => acc + file.size, 0);

    const newData = folderData.map((folder) => {
      let pathFolder = folder.file.path || folder.file.webkitRelativePath;
      if (pathFolder.startsWith("/")) {
        pathFolder = String(pathFolder).substring(1);
      }

      return {
        type: folder.file.type,
        size: folder.file.size.toString(),
        path: pathFolder,
      };
    });

    try {
      const folderUploadResponse = await uploadFolderAction({
        variables: {
          data: {
            checkFolder: "main",
            pathFolder: newData,
            folder_type: "folder",
          },
        },
      });

      if (folderUploadResponse.data?.uploadFolder.status === 200) {
        folderData.map(async (folder, index) => {
          let file = folder.file;
          const url = "https://coding.load.vshare.net/upload";
          const newName = Math.floor(1111111 + Math.random() * 9999999);

          const formData = new FormData();
          formData.append("file", file);

          const extension = file?.name?.lastIndexOf(".");
          const fileExtension = file.name?.slice(extension);
          const secretKey = "jsje3j3,02.3j2jk";
          const headers = {
            REGION: "sg",
            BASE_HOSTNAME: "storage.bunnycdn.com",
            STORAGE_ZONE_NAME: "beta-vshare",
            ACCESS_KEY: "a4287d4c-7e6c-4643-a829f030bc10-98a9-42c3",
            PATH: "6722542899692-114",
            FILENAME: `${newName}${fileExtension}`,
            PATH_FOR_THUMBNAIL: "6722542899692-114",
          };

          const key = CryptoJS.enc.Utf8.parse(secretKey);
          const iv = CryptoJS.lib.WordArray.random(16);
          const encrypted = CryptoJS.AES.encrypt(JSON.stringify(headers), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
          const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
          const ivText = iv.toString(CryptoJS.enc.Base64);
          const encryptedData = cipherText + ":" + ivText;

          await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              encryptedHeaders: encryptedData,
            },
            onUploadProgress: (progressEvent) => {
              const currentFileUploadedSize =
                (progressEvent.loaded * parseInt(folderData[index].size)) /
                progressEvent.total;
              currentUploadPercentage = (
                ((uploadedSize + currentFileUploadedSize) / totalSize) *
                100
              ).toFixed(0);

              setTotalProgress(currentUploadPercentage);
              const percentComplete = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prevProgress) => ({
                ...prevProgress,
                [index]: percentComplete,
              }));
            },
          });

          console.log("Upload successful");
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    try {
      const uppy = new Uppy({
        allowMultipleUploadBatches: true,
        restrictions: {},
        allowedFileTypes: null, // Accept all file types
      });

      uppy.use(DragDrop, {});
      uppy.use(XHRUpload, {
        endpoint: "https://coding.load.vshare.net/upload",
      });

      setUppyInstance(uppy);

      return () => {
        uppy.close();
      };
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (folderData.length) {
      // const folderNames = [...new Set(folderData.map((folder) => folder))];
      // console.log(JSON.stringify(folderNames));
    }
  }, [folderData]);

  return (
    <Fragment>
      <Header />
      <Box sx={{ my: 2, mx: 2 }}>
        <h2>UploadFile</h2>

        <input
          ref={folderRef}
          type="file"
          hidden={true}
          // style={{ display: "none" }}
          webkitdirectory="true"
          directory="true"
          onChange={handleFolder}
        />
        {/* <input type="file" multiple={true} onChange={handleFile} /> */}

        <Button variant="contained" onClick={handleUploadFolder} sx={{ mt: 1 }}>
          Upload
        </Button>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ maxWidth: "992px", margin: "0 auto" }}>
            <MUI.UploadFolderContainer>
              <MUI.UploadFolderHeaderContainer>
                <MUI.UploadFolderHeader>
                  <MUI.UploadFolderCancelButton>
                    Cancel
                  </MUI.UploadFolderCancelButton>
                  <Typography variant="h4">
                    {lengthOfFolder()} Folder selected
                  </Typography>

                  <MUI.UploadFolderAddMoreButton onClick={handleFolderTrigger}>
                    <FaPlus
                      style={{ marginRight: "10px", verticalAlign: "middle" }}
                    />{" "}
                    Add more
                  </MUI.UploadFolderAddMoreButton>
                </MUI.UploadFolderHeader>
              </MUI.UploadFolderHeaderContainer>

              {/* {...getRootProps()} */}
              <MUI.UploadFolderBody>
                <div {...getRootProps()}>
                  <div
                    style={{
                      border: "2px dashed #0087F7",
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "5px",
                      cursor: "pointer",
                      outline: "none",
                    }}
                  >
                    <input
                      {...getInputProps()}
                      type="file"
                      hidden={true}
                      style={{ display: "none" }}
                      webkitdirectory="true"
                      directory="true"
                    />
                    <p>
                      {isDragActive
                        ? "Drop the files here ..."
                        : "Upload, Drag and drop your files here to upload"}
                    </p>
                  </div>
                </div>
                <Grid container spacing={2} mt={3}>
                  {[
                    ...new Set(
                      folderData.map(
                        (folder) => folder.webkitRelativePath.split("/")[0]
                      )
                    ),
                  ].map((folderPath, index) => {
                    const fileInFolder = folderData.filter((folder) =>
                      String(folder.webkitRelativePath).startsWith(folderPath)
                    ).length;

                    return (
                      <Grid item xs={12} md={6} lg={3} key={index}>
                        <div
                          style={{
                            position: "relative",
                            borderRadius: "10px",
                            backgroundColor: "#f2f2f2",
                          }}
                        >
                          <div
                            style={{ position: "absolute", top: 10, right: 10 }}
                            onClick={() => removeFolder(folderPath)}
                          >
                            <FaTimesCircle
                              style={{
                                fontSize: "22px",
                                cursor: "pointer",
                                color: "#5c5c5c",
                              }}
                            />
                          </div>
                          <MyfolderFull />

                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                            }}
                          >
                            <CircularProgressbarWithChildren
                              value={uploadProgress[index]}
                              styles={buildStyles({
                                textSize: "10px",
                                pathColor: "#4caf50",
                                textColor: "#000",
                              })}
                            >
                              {uploadProgress[index] < 100 ? (
                                <Fragment>
                                  <h4 style={{ fontSize: 15, color: "#fff" }}>
                                    {uploadProgress[index]}%
                                  </h4>
                                </Fragment>
                              ) : (
                                <FaCheckCircle fontSize={27} color="#17766B" />
                              )}
                            </CircularProgressbarWithChildren>
                          </div>
                          <div
                            style={{
                              margin: "1rem 0",
                              width: "100%",
                              position: "absolute",
                              bottom: "-5px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <p
                                style={{
                                  color: "#4B465C",
                                  fontSize: "0.95rem",
                                  fontWeight: "500",
                                  margin: "0",
                                }}
                              >
                                1/{fileInFolder}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="content"
                          style={{ marginTop: "14px", textAlign: "center" }}
                        >
                          <h4 style={{ margin: "0" }}>{folderPath}</h4>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </MUI.UploadFolderBody>
            </MUI.UploadFolderContainer>

            <MUI.ButtonActionContainer>
              <MUI.ButtonCancelAction>Cancel</MUI.ButtonCancelAction>
              <MUI.ButtonUploadAction onClick={uploadFolder}>
                Upload {lengthOfFolder() ? lengthOfFolder() : ""} folders
              </MUI.ButtonUploadAction>
            </MUI.ButtonActionContainer>
          </Box>
        </Box>
      </Box>
    </Fragment>
  );
}

export default UploadFile;
