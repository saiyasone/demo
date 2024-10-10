import React, { useEffect, useMemo, useRef, useState } from "react";
import { encryptData } from "../utils/secure";
import Header from "../components/layouts/header";
import { convertBytetoMBandGB, getFileNameExtension } from "../utils/file.util";
import { gql, useMutation } from "@apollo/client";
import { LinearProgress } from "@mui/material";
import CustomLinearProgress from "../components/customLinearProgress";

function MultipleFileUpload() {
  const MUTATION_CREATE_FILE = gql`
    mutation CreateFiles($data: FilesInput!) {
      createFiles(data: $data) {
        _id
        path
      }
    }
  `;

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [totalFileSize, setTotalFileSize] = useState(0);
  const [totalProgress, setTotalProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState([]);
  const [totalTimeTaken, setTotalTimeTaken] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Track real-time elapsed time
  const [timer, setTimer] = useState(null);
  const [uploadTimes, setUploadTimes] = useState([]);
  const [allUploaded, setAllUploaded] = useState(false);
  const fileRef = useRef(null);
  const [abortControllers, setAbortControllers] = useState([]);

  const [uploadFiles] = useMutation(MUTATION_CREATE_FILE);

  const endpoints = "https://staging.load.vshare.net/";
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData"))
    : "";

  async function initiateMultipartUpload(file) {
    const headers = {
      createdBy: userData?._id,
      FILENAME: file.newFilename,
      PATH: `${userData?.newName}-${userData?._id}`,
    };
    const _encryptHeader = await encryptData(headers);

    const response = await fetch(`${endpoints}initiate-multipart-upload`, {
      method: "POST",
      headers: {
        encryptedheaders: _encryptHeader,
      },
    });

    const data = await response.json();
    return data;
  }

  async function getPresignedUrl(uploadId, partNumber, fileName) {
    const headers = {
      createdBy: userData?._id,
      FILENAME: fileName,
      PATH: `${userData?.newName}-${userData?._id}`,
    };

    const _encryptHeader = await encryptData(headers);
    const formData = new FormData();
    formData.append("partNumber", partNumber.toString());
    formData.append("uploadId", uploadId);
    formData.append("FILENAME", fileName);

    const response = await fetch(`${endpoints}generate-presigned-url`, {
      method: "POST",
      body: formData,
      headers: {
        encryptedheaders: _encryptHeader,
      },
    });

    const data = await response.json();
    return data.url; // Presigned URL for the specific part
  }

  async function uploadPart(presignedUrl, filePart, signal) {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: filePart,
      signal,
    });

    if (!response.ok) {
      throw new Error("Failed to upload part");
    }

    // Return the ETag for the uploaded part (needed to complete the multipart upload)
    return response.headers.get("ETag");
  }

  async function completeMultipartUpload(uploadId, parts, fileName) {
    const headers = {
      createdBy: userData?._id,
      FILENAME: fileName,
      PATH: `${userData?.newName}-${userData?._id}`,
    };

    const _encryptHeader = await encryptData(headers);
    const formData = new FormData();

    formData.append("FILENAME", fileName);
    formData.append("parts", JSON.stringify(parts));
    formData.append("uploadId", uploadId);

    const response = await fetch(`${endpoints}complete-multipart-upload`, {
      method: "POST",
      body: formData,
      headers: {
        encryptedheaders: _encryptHeader,
      },
    });

    const data = await response.json();
    return data;
  }

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setTotalProgress(0);
      setUploadStatus(filesArray.map(() => "pending"));

      const totalSize = filesArray.reduce(
        (total, file) => total + file.size,
        0
      );
      setTotalFileSize(totalSize);
      setSelectedFiles(filesArray);
      setUploadProgress(
        filesArray.map((file) => ({ file, progress: 0, status: "pending" }))
      );

      const controllers = filesArray.map(() => new AbortController());
      setAbortControllers(controllers);
    }
  };

  const uploadFile = async (file, index, totalParts, controller) => {
    const startTime = performance.now();

    try {
      const { uploadId } = await initiateMultipartUpload(file);

      const partSize = 5 * 1024 * 1024; // 5 MB
      const numberOfParts = Math.ceil(file.size / partSize);
      const parts = [];

      for (let partNumber = 1; partNumber <= numberOfParts; partNumber++) {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(partNumber * partSize, file.size);
        const filePart = file.slice(start, end);

        const presignedUrl = await getPresignedUrl(
          uploadId,
          partNumber,
          file.newFilename
        );
        const eTag = await uploadPart(
          presignedUrl,
          filePart,
          controller?.signal
        );

        parts.push({ ETag: eTag, PartNumber: partNumber });

        // Update progress
        const progressPercentage = Math.round(
          (partNumber / numberOfParts) * 100
        );

        updateProgress(index, progressPercentage, "uploading");

        // total progress
        // setTotalPartsUploaded((prevTotalParts) => {
        //   const updatedTotalParts = prevTotalParts + 1;
        //   const progressTotalPercentage = Math.round(
        //     (updatedTotalParts / totalParts) * 100
        //   );

        //   setTotalProgress(
        //     progressTotalPercentage >= 100 ? 99 : progressTotalPercentage
        //   );
        //   console.log(progressTotalPercentage);

        //   return updatedTotalParts;
        // });
      }

      await completeMultipartUpload(uploadId, parts, file.newFilename);

      updateFileStatus(index, "completed");
      updateProgress(index, 100, "completed");

      const endTime = performance.now();
      const timeTaken = (endTime - startTime) / 1000;

      setUploadTimes((prevTimes) => {
        const newTimes = [...prevTimes];
        newTimes[index] = timeTaken;
        return newTimes;
      });

      checkAllFilesUploaded();
    } catch (error) {
      if (controller.signal.aborted) {
        updateProgress(index, 0, "canceled");
      } else {
        updateProgress(index, 0, "failed");
      }
    }
  };

  const cancelUpload = (index) => {
    const controller = abortControllers[index];
    if (controller) {
      controller.abort();
    }
  };

  const updateProgress = (index, progress, status) => {
    setUploadProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newProgress[index] = { ...newProgress[index], progress, status };

      const totalUploaded = newProgress.reduce((total, fileProgress) => {
        return total + (fileProgress.file.size * fileProgress.progress) / 100;
      }, 0);

      const totalPercentage = Math.round((totalUploaded / totalFileSize) * 100);
      setTotalProgress(totalPercentage);

      return newProgress;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length > 0) {
      const totalParts = selectedFiles.reduce((acc, file) => {
        const partSize = 5 * 1024 * 1024; // 5 MB
        return acc + Math.ceil(file.size / partSize);
      }, 0);

      const startTime = performance.now();
      setTimer(
        setInterval(() => {
          setElapsedTime((performance.now() - startTime) / 1000); // Update elapsed time in seconds
        }, 1000)
      );

      const uploadPromise = selectedFiles.map(async (file, index) => {
        const controller = abortControllers[index];

        const randomNewName = Math.floor(111111111 + Math.random() * 999999999);
        const newFileName = `${randomNewName}${getFileNameExtension(
          file.name
        )}`;

        const dataFile = file;
        dataFile.newFilename = newFileName;

        return uploadFile(dataFile, index, totalParts, controller);
      });

      await Promise.all(uploadPromise);
      const endTime = performance.now();
      const totalTime = (endTime - startTime) / 1000; // Time in seconds
      setTotalTimeTaken(totalTime);
    }
  };

  const checkAllFilesUploaded = () => {
    if (uploadStatus.every((status) => status === "completed")) {
      setAllUploaded(true);
    }
  };

  const updateFileStatus = (index, status) => {
    setUploadStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = status;
      return newStatus;
    });
  };

  const handleClearData = () => {
    fileRef.current.value = "";
    setUploadStatus([]);
    clearInterval(timer);
  };

  // const uploading = await uploadFiles({
  //   variables: {
  //     data: {
  //       destination: "",
  //       newFilename: newFileName,
  //       filename: file.name,
  //       fileType: file.type,
  //       size: file.size.toString(),
  //       checkFile: "sub",
  //       country: "india",
  //       device: "pc",
  //       totalUploadFile: selectedFiles.length,
  //       newPath: `${"757688d3-4b0f-4dc5-ab73-daab881882a8"}/${newFileName}`,
  //       folder_id: "728",
  //     },
  //   },
  // });

  // const fileId = await uploading.data?.createFiles?._id;

  // if (fileId) {
  //   const dataFile = file;
  //   dataFile.newFilename = newFileName;

  //   return uploadFile(dataFile, index, totalParts);
  // }

  const resetFileData = () => {
    fileRef.current.value = "";
    setUploadStatus([]);
    setTotalProgress(0);
    setAllUploaded(false);
    setTimer(null);
    clearInterval(timer);
    setElapsedTime(0);
    setTotalTimeTaken(null);

    setUploadTimes([]);
    setSelectedFiles([]);
    setUploadProgress([]);
  };

  const timeTakenData = useMemo(() => {
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;

    return { minutes, seconds };
  }, [elapsedTime]);

  useEffect(() => {
    if (uploadStatus.length > 0) {
      if (uploadStatus.every((status) => status === "completed")) {
        setAllUploaded(true);
        handleClearData();
      }
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (uploadProgress.length > 0) {
      if (uploadProgress.every((progress) => progress.status === "canceled")) {
        fileRef.current.value = "";
        console.log("files are canceled")
        clearInterval(timer);
        setTimer(null);
        setTotalProgress(0);
        setElapsedTime(0);
        setUploadTimes([]);
      }
    }
  }, [uploadProgress]);

  async function handleCancelAll() {
    if (selectedFiles.length > 0) {
      if (uploadProgress.every((progress) => progress.status === "uploading")) {
        const cancelPromise = selectedFiles.map((_, index) =>
          cancelUpload(index)
        );

        await Promise.all(cancelPromise);
        fileRef.current.value = "";
        clearInterval(timer);
        setTimer(null);
        setTotalProgress(0);
        setElapsedTime(0);
        setUploadTimes([]);
      }
    }
  }

  return (
    <div>
      <Header />
      <div style={{ padding: "1rem" }}>
        <input type="file" multiple onChange={handleFileChange} ref={fileRef} />
        <div style={{ margin: "0.8rem 0", display: "flex", gap: "12px" }}>
          <button onClick={handleUpload}>Upload Files</button>
          <button onClick={resetFileData}>Reset Files</button>
          <button onClick={handleCancelAll}>cancel all</button>
        </div>

        <div style={{ margin: "2rem 0" }}>
          <h2>Total progress {totalProgress}% </h2>

          <div style={{ margin: "12px 0" }}>
            <CustomLinearProgress value={totalProgress} variant="determinate" />
          </div>

          {totalTimeTaken && (
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#17766B",
                fontWeight: "bold",
              }}
            >
              Time taken: {totalTimeTaken.toFixed(2)} seconds
            </h3>
          )}

          <h4> elapsed: {elapsedTime.toFixed(0)} </h4>

          <h4>
            {" "}
            times:{" "}
            {timeTakenData.minutes === 0
              ? ""
              : timeTakenData.minutes.toFixed(0) + " m"}{" "}
            {timeTakenData.seconds === 0
              ? ""
              : timeTakenData.seconds.toFixed(0) + " s"}
          </h4>

          {allUploaded && (
            <h3
              style={{
                fontSize: "1.5rem",
                color: "#17766B",
                fontWeight: "bold",
              }}
            >
              All files uploaded successfully!
            </h3>
          )}
        </div>
        <div>
          {uploadProgress.map((progress, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "0.6rem 1rem",
                margin: "0.7rem 0",
                borderRadius: "5px",
              }}
            >
              <p>
                {progress.file.name} {progress.progress}%{" "}
                {convertBytetoMBandGB(progress.file?.size || 0)}{" "}
              </p>
              <p>
                Status:{" "}
                <strong
                  style={{
                    color: progress.status === "canceled" ? "red" : "black",
                  }}
                >
                  {progress.status}
                </strong>{" "}
              </p>

              <div style={{ margin: "12px 0" }}>
                <LinearProgress variant="determinate" value={progress.progress}>
                  {progress.progress}%
                </LinearProgress>
              </div>

              {/* Cancel button */}
              {progress.status === "uploading" && (
                <button onClick={() => cancelUpload(index)}>Cancel</button>
              )}

              {uploadTimes[index] && (
                <p>Time taken: {uploadTimes[index].toFixed(2)} seconds</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MultipleFileUpload;
