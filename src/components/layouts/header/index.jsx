import { useEffect, useState } from "react";
import { HeaderContainer, HeaderNav } from "./css";
import { NavLink } from "react-router-dom";
import logo from "../../../utils/images/logo192.png";
import { Box } from "@mui/material";

function Header() {
  const [token] = useState(() => localStorage.getItem("token"));
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    // const scroll = window.scrollY;

    document.addEventListener("scroll", (event) => {
      const scrollY = window.scrollY;
      console.log({ scrollY });
      if (scrollY >= 200) {
        setIsToggle(true);
      } else {
        setIsToggle(false);
      }
    });
  }, []);

  return (
    <Box sx={{ paddingBottom: "4rem" }}>
      <HeaderContainer sx={{ background: isToggle ? "#252B2D" : "#fff" }}>
        <HeaderNav isToggle={isToggle}>
          <img src={logo} alt="logo" />
          <ul>
            <li>
              <NavLink to="/">Uppy</NavLink>
              <NavLink to="/animate">Animation</NavLink>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/tiktok">Tiktok</NavLink>
              <NavLink to="/player">React player</NavLink>
              <NavLink to="/upload">upload</NavLink>
              <NavLink to="/google-ads">Google ads</NavLink>
              <NavLink to="/folder">Presign url</NavLink>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </HeaderNav>
      </HeaderContainer>
    </Box>
  );
}

export default Header;
