import { Fragment, useState } from "react";
import { HeaderContainer, HeaderNav } from "./css";
import { NavLink } from "react-router-dom";
import logo from "../../../utils/images/logo192.png";

function Header() {
  const [token] = useState(() => localStorage.getItem("token"));
  return (
    <Fragment>
      <HeaderContainer maxWidth="lg">
        <HeaderNav>
          <img src={logo} alt="logo" />

          <ul>
            <li>
              <NavLink to="/">Uppy</NavLink>
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
    </Fragment>
  );
}

export default Header;
