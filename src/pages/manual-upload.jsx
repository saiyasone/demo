import React, { useState } from "react";
import { encryptData } from "../utils/secure";
import Header from "../components/layouts/header";
const endpoints = "https://coding.load.vshare.net/";
const userData = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData"))
  : "";

async function initiateMultipartUpload(file) {
  const headers = {
    createdBy: userData?._id,
    FILENAME: file.name,
    PATH: `${userData?.newName}-${userData?._id}}`,
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
    PATH: `${userData?.newName}-${userData?._id}}`,
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

async function uploadPart(presignedUrl, filePart) {
  const response = await fetch(presignedUrl, {
    method: "PUT",
    body: filePart,
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
    PATH: `${userData?.newName}-${userData?._id}}`,
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

function MultipleFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState([]);

  const handleFileChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      setUploadProgress(
        filesArray.map((file) => ({ file, progress: 0, status: "pending" }))
      );
    }
  };

  const uploadFile = async (file, index) => {
    try {
      const { uploadId } = await initiateMultipartUpload(file);

      const partSize = 10 * 1024 * 1024; // 10 MB
      const numberOfParts = Math.ceil(file.size / partSize);
      const parts = [];

      for (let partNumber = 1; partNumber <= numberOfParts; partNumber++) {
        const start = (partNumber - 1) * partSize;
        const end = Math.min(partNumber * partSize, file.size);
        const filePart = file.slice(start, end);

        const presignedUrl = await getPresignedUrl(
          uploadId,
          partNumber,
          file.name
        );
        const eTag = await uploadPart(presignedUrl, filePart);

        parts.push({ ETag: eTag, PartNumber: partNumber });

        // Update progress
        const progressPercentage = Math.round(
          (partNumber / numberOfParts) * 100
        );
        updateProgress(index, progressPercentage, "uploading");
      }

      // 3. Complete multipart upload
      await completeMultipartUpload(uploadId, parts, file.name);
      updateProgress(index, 100, "completed");
    } catch (error) {
      updateProgress(index, 0, "failed");
    }
  };

  const updateProgress = (index, progress, status) => {
    setUploadProgress((prevProgress) => {
      const newProgress = [...prevProgress];
      newProgress[index] = { ...newProgress[index], progress, status };
      return newProgress;
    });
  };

  const handleUpload = () => {
    selectedFiles.forEach((file, index) => {
      uploadFile(file, index);
    });
  };

  return (
    <div>
      <Header />
      <div style={{ padding: "1rem" }}>
        <input type="file" multiple onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Files</button>

        <div>
          {uploadProgress.map((progress, index) => (
            <div key={index}>
              <p>{progress.file.name}</p>
              <p>Status: {progress.status}</p>
              <progress value={progress.progress} max="100">
                {progress.progress}%
              </progress>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MultipleFileUpload;
