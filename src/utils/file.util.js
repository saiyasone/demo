export function getFileNameExtension(filename) {
  const dotIndex = filename?.lastIndexOf(".");
  if (dotIndex !== -1) {
    const fileExtension = filename?.slice?.(dotIndex);
    return fileExtension;
  } else {
    return "";
  }
}
