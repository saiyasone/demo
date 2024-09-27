import { createBrowserRouter } from "react-router-dom";
import IsAuthenticated from "./guards/isAuthenticate";
import Home from "./pages/home";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Coupon from "./pages/coupon";
import UploadFile from "./pages/upload";
import UppyManual from "./pages/google-ads";
import UppyPackageAw3 from "./pages/uppy-aw3";

const routers = createBrowserRouter([
  {
    path: "",
    element: (
      <IsAuthenticated>
        {/* <UppyPackage /> */}
        <UppyPackageAw3 />
      </IsAuthenticated>
    ),
  },
  {
    path: "/home",
    element: <Home />,
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
    path: 'presign-url',
    
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
