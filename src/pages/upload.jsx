import React, { Fragment, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { Box, Button, Grid } from "@mui/material";
import axios from "axios";
import Header from "../components/layouts/header";
import { UPLOAD_FILE } from "../apollo/upload";
import { useMutation } from "@apollo/client";
import { Uppy } from "@uppy/core";
import { DragDrop } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";
import "@uppy/core/dist/style.css";
import "@uppy/drag-drop/dist/style.css";
import { ReactComponent as IconMyfolerFull } from "./../images/FolderIcon.svg";

const MyfolderFull = () => {
  return <IconMyfolerFull />;
};

function UploadFile() {
  const [fileData, setFileData] = useState([]);
  const [folderData, setFolderData] = useState([]);
  const [uploadFileAction] = useMutation(UPLOAD_FILE);
  const [uppyInstance, setUppyInstance] = useState(new Uppy());

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

      return () => {
        uppy.close();
      };
    } catch (error) {}
  }, []);

  return (
    <Fragment>
      <Header />
      <Box sx={{ my: 2, mx: 2 }}>
        <h2>UploadFile</h2>

        {/* <input
          directory=""
          type="file"
          webkitdirectory=""
          mozdirectory="true"
          multiple={true}
          onChange={handleFile}
        /> */}

        <input
          type="file"
          style={{ display: "block" }}
          webkitdirectory="true"
          directory="true"
          multiple={false}
          onChange={handleFolder}
        />

        <Button variant="contained" onClick={handleUpload} sx={{ mt: 1 }}>
          Upload
        </Button>

        <Box sx={{ mt: 3 }}>
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
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <div style={{ position: "relative" }}>
                    <MyfolderFull />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div style={{}}>
                        <p>1/{fileInFolder}</p>
                        <span> {JSON.stringify(folderPath)} </span>
                      </div>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
}

export default UploadFile;
