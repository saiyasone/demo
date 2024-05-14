import { toast } from "react-toastify";
export const successMessage = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    theme: "colored",
    hideProgressBar: true,
  });
};

export const errorMessage = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 2000,
    closeOnClick: true,
    theme: "colored",
    hideProgressBar: true,
  });
};
