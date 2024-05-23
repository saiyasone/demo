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
import { FaTimesCircle, FaPlus } from "react-icons/fa";
import Header from "../components/layouts/header";
import { UPLOAD_FILE } from "../apollo/upload";
import { useMutation } from "@apollo/client";
import { Uppy } from "@uppy/core";
import { DragDrop } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { ReactComponent as IconMyfolerFull } from "./../images/FolderIcon.svg";
import * as MUI from "../styles/upload-style";
import { useDropzone } from "react-dropzone";
import FolderIcon from "../images/FolderIcon.png";

const MyfolderFull = () => {
  return <IconMyfolerFull />;
};

function UploadFile() {
  const folderRef = useRef();
  const [fileData, setFileData] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const [uppyInstance, setUppyInstance] = useState(new Uppy());

  const onDrop = useCallback((acceptedFiles) => {
    const folderNames = new Set();
    const folders = [];
    acceptedFiles.forEach((file) => {
      const pathSegments = file.path?.split("/")[1];
      if (pathSegments.length > 1) {
        folderNames.add(pathSegments);
      }

      folders.push({ ...{ ...file, webkitRelativePath: pathSegments } });
    });

    setFolderData((prev) => {
      return [...prev, ...folders];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function handleFile(event) {
    const { files } = event.target;
    setFileData(Array.from(files));
  }

  function handleFolder(evt) {
    const { files } = evt.target;
    const folders = Array.from(files).filter((file) =>
      file.webkitRelativePath.includes("/")
    );

    setFolderData((prev) => {
      return [...prev, ...folders];
    });
  }

  function lengthOfFolder() {
    return [
      ...new Set(
        folderData.map((folder) => folder.webkitRelativePath.split("/")[0])
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

  async function uploadFolder() {
    try {
      // const response = await axios.post(
      //   `http://192.168.100.49:4002/api/folders`,
      //   {
      //     folderName: "Web Application",
      //   }
      // );
      // const resData = await response.data;
      // console.log(resData);
      [
        ...new Set(
          folderData.map((folder) => folder.webkitRelativePath.split("/")[0])
        ),
      ].map(async (folder) => {
        const response = await axios.post(
          `http://192.168.100.49:4002/api/folders`,
          {
            folderName: folder,
          }
        );

        const resData = await response.data;
        console.log(resData);
      });
    } catch (error) {}
  }

  function removeFolder(folderName) {
    setFolderData((prev) =>
      prev.filter((folder) => {
        return folder.webkitRelativePath.split("/")[0] !== folderName;
      })
    );
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
      const folderNames = [...new Set(folderData.map((folder) => folder))];

      console.log(JSON.stringify(folderNames));
    }
  }, [folderData]);

  return (
    <Fragment>
      <Header />
      <Box sx={{ my: 2, mx: 2 }}>
        <h2>UploadFile</h2>

        <input directory="" type="file" onChange={handleFile} />

        <input
          ref={folderRef}
          type="file"
          hidden={true}
          style={{ display: "none" }}
          webkitdirectory="true"
          directory="true"
          onChange={handleFolder}
        />

        <Button variant="contained" onClick={handleUpload} sx={{ mt: 1 }}>
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
                  // style={{
                  //   border: "2px dashed #0087F7",
                  //   padding: "30px 20px",
                  //   textAlign: "center",
                  //   borderRadius: "5px",
                  // }}
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
                <Grid container spacing={2}>
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
