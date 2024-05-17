import { createBrowserRouter } from "react-router-dom";
import IsAuthenticated from "./guards/isAuthenticate";
import Home from "./pages/home";
import Login from "./pages/login";
import Contact from "./pages/contact";
import Coupon from "./pages/coupon";
import UppyPackage from "./pages/uppy";
import UploadFile from "./pages/upload";

const routers = createBrowserRouter([
  {
    path: "",
    element: (
      <IsAuthenticated>
        <UppyPackage />
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
