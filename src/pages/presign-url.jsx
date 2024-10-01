import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

const endpoints = "https://coding.load.vshare.net"; // Your endpoint for file upload
const newPath = "059d6c72-0da6-430a-8829-6d73cc04a725"; // Change this accordingly

async function encryptData(data) {
  // Implement encryption logic or use the one you already have
  return btoa(JSON.stringify(data)); // Dummy encryption example
}

async function createMultipartUpload(file, userData) {
  const headers = {
    createdBy: userData._id,
    FILENAME: file.name,
    PATH: `${userData.newName}-${userData._id}/${newPath}`,
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

async function getPresignedUrl(uploadId, key, partNumber, file, userData) {
  const headers = {
    createdBy: userData._id,
    FILENAME: file.name,
    PATH: `${userData.newName}-${userData._id}/${newPath}`,
  };
  const _encryptHeader = await encryptData(headers);

  const formData = new FormData();
  formData.append("partNumber", partNumber.toString());
  formData.append("uploadId", uploadId);
  formData.append("FILENAME", file.name);

  return fetch(`${endpoints}/generate-presigned-url`, {
    method: "POST",
    body: formData,
    headers: {
      encryptedheaders: _encryptHeader,
    },
  })
    .then((response) => response.json())
    .then((data) => data.url);
}

async function uploadPart(presignedUrl, filePart) {
  return fetch(presignedUrl, {
    method: "PUT",
    body: filePart,
  });
}

async function completeMultipartUpload(file, uploadId, parts, userData) {
  const headers = {
    createdBy: userData._id,
    FILENAME: file.name,
    PATH: `${userData.newName}-${userData._id}/${newPath}`,
  };
  const _encryptHeader = await encryptData(headers);

  const formData = new FormData();
  formData.append("parts", JSON.stringify(parts));
  formData.append("uploadId", uploadId);
  formData.append("FILENAME", file.name);

  return fetch(`${endpoints}/complete-multipart-upload`, {
    method: "POST",
    body: formData,
    headers: {
      encryptedheaders: _encryptHeader,
    },
  }).then((response) => response.json());
}

function PresignURL() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const userData = JSON.parse(localStorage.getItem("userData")) || "";

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const uploadFiles = async () => {
    for (const file of selectedFiles) {
      const { uploadId, key } = await createMultipartUpload(file, userData);
      const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
      const totalParts = Math.ceil(file.size / chunkSize);
      const parts = [];

      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = partNumber * chunkSize;
        const filePart = file.slice(start, end);

        const presignedUrl = await getPresignedUrl(
          uploadId,
          key,
          partNumber,
          file,
          userData
        );
        console.log({ presignedUrl });
        const dataPart = await uploadPart(presignedUrl, filePart);
        console.log({ dataPart });

        parts.push({ PartNumber: partNumber, ETag: "dummy-etag" }); // Replace ETag with actual value from response

        setUploadProgress((prev) => ({
          ...prev,
          [file.name]: (partNumber / totalParts) * 100,
        }));
      }

      await completeMultipartUpload(file, uploadId, parts, userData);
    }
  };

  return (
    <Box sx={{ my: 4, mx: 4 }}>
      <Typography variant="h5">Custom File Uploader</Typography>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={uploadFiles}>Upload Files</button>

      {selectedFiles.length > 0 && (
        <div>
          {Array.from(selectedFiles).map((file) => (
            <div key={file.name}>
              <Typography>{file.name}</Typography>
              <progress
                value={uploadProgress[file.name] || 0}
                max="100"
              ></progress>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}

export default PresignURL;
