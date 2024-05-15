import React, { Fragment, useState } from "react";
import CryptoJS from "crypto-js";
import { Box, Button } from "@mui/material";
import axios from "axios";
import Header from "../components/layouts/header";
import { UPLOAD_FILE } from "../apollo/upload";
import { useMutation } from "@apollo/client";

function UploadFile() {
  const [fileData, setFileData] = useState([]);
  const [uploadFileAction] = useMutation(UPLOAD_FILE);

  function handleFile(event) {
    const { files } = event.target;
    setFileData(Array.from(files));
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

  return (
    <Fragment>
      <Header />
      <Box sx={{ my: 2, mx: 2 }}>
        <h2>UploadFile</h2>

        <input type="file" multiple={true} onChange={handleFile} />

        <Button variant="contained" onClick={handleUpload}>
          Upload
        </Button>

        <Box sx={{ mt: 3 }}>
          <ul>
            {fileData.map((file, index) => {
              return <li key={index}>{file.name}</li>;
            })}
          </ul>
        </Box>
      </Box>
    </Fragment>
  );
}

export default UploadFile;
