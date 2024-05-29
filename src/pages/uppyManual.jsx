import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { FaCheckCircle } from "react-icons/fa";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "../styles/uppy-manual.css";
import "react-circular-progressbar/dist/styles.css";
import Header from "../components/layouts/header";

function UppyManual() {
  const [totalProgress, setTotalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFilesChange = (event) => {
    const { files: myFiles } = event.target;

    const newFiles = Array.from(myFiles);
    const updateFiles = [...files, ...newFiles];

    const newUploadProgress = { ...uploadProgress };
    updateFiles.forEach((_, index) => {
      if (!(index in newUploadProgress)) {
        newUploadProgress[index] = 0;
      }
    });

    setFiles(updateFiles);
    setUploadProgress(newUploadProgress);
  };

  const handleFileProgress = async () => {
    // for (let i = 0; i < files.length; i++) {
    //   const newUploadProgress = {};
    //   newUploadProgress[i] = 0;
    //   setUploadProgress(newUploadProgress);
    // }

    for (let i = 0; i < files.length; i++) {
      uploadFile({ file: files[i], index: i });
    }
  };

  const uploadFile = async ({ file, index }) => {
    let uploadedSize = 0;
    let currentUploadPercentage = 0;
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    try {
      const url = "https://coding.load.vshare.net/upload";
      const newName = Math.floor(11111 + Math.random() * 99999);
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

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          encryptedHeaders: encryptedData,
        },
        onUploadProgress: (progressEvent) => {
          const currentFileUploadedSize =
            (progressEvent.loaded * parseInt(files[index].size)) /
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

      console.log(
        "Reponse from upload progress update complete",
        response.data
      );
    } catch (error) {
      console.log("Error uploading file", error);
    }
  };

  useEffect(() => {
    if (files.length > 0) {
      // const newFiles = files.map((file) => file.size);
      // console.log(newFiles);
    }
  }, [files]);

  return (
    <Fragment>
      <Header />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <div className="file-upload-container">
          <div className="file-upload">
            <div>
              <input type="file" multiple={true} onChange={handleFilesChange} />
              <button className="btn btn-primary" onClick={handleFileProgress}>
                <i className="fa-solid fa-cloud-arrow-up"></i>
                Upload
              </button>
            </div>
            <div className="progress-list">
              {files.map((file, index) => (
                <div key={index} className="progress-item">
                  <div className="progress-file">
                    <span>{file.name}</span>
                  </div>
                  <div className="progress-container">
                    <div className="circular-progress">
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
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ width: "100%", marginTop: "0.8rem" }}>
                <progress
                  className="progress"
                  value={totalProgress}
                  max={100}
                ></progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default UppyManual;
