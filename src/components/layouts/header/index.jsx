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
              {!!token && <NavLink to="/">Uppy</NavLink>}
              <NavLink to="/home">Home</NavLink>
              {!!token && <NavLink to="/upload">upload</NavLink>}
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/coupon">Coupon</NavLink>
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
        </HeaderNav>
      </HeaderContainer>
    </Fragment>
  );
}

export default Header;
