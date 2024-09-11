import { ENV_FILE } from "./env";
import CryptoJS from "crypto-js";

export const encryptData = (model) => {
    const secretKey = ENV_FILE.REACT_APP_UPLOAD_SECRET_KEY;
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(model), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const ivText = iv.toString(CryptoJS.enc.Base64);
    const encryptedData = cipherText + ":" + ivText;
    return encryptedData;
  };