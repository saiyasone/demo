import { createBrowserRouter } from "react-router-dom";
import IsAuthenticated from "./guards/isAuthenticate";
import Home from "./pages/home";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Coupon from "./pages/coupon";
import UploadFile from "./pages/upload";
import UppyManual from "./pages/google-ads";
import UppyPackageAw3 from "./pages/uppy-aw3";
import MultipleFileUpload from "./pages/manual-upload";
import VideoEditor from "./pages/video-editor";
import VideoPreview from "./pages/video-preview";

const routers = createBrowserRouter([
  {
    path: "",
    element: <VideoPreview />,
    // <IsAuthenticated>
    //   {/* <UppyPackage /> */}
    //   <UppyPackageAw3 />
    // </IsAuthenticated>
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/player",
    element: <VideoEditor />,
  },
  {
    path: "/folder",
    element: <MultipleFileUpload />,
  },
  {
    path: "/upload",
    element: (
      <IsAuthenticated>
        <UploadFile />,
      </IsAuthenticated>
    ),
  },
  {
    path: "presign-url",
  },
  {
    path: "/google-ads",
    element: (
      <IsAuthenticated>
        <UppyManual />,
      </IsAuthenticated>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/coupon",
    element: <Coupon />,
  },
]);

export default routers;
