import { Fragment } from "react";
import { HeaderContainer, HeaderNav } from "./css";
import { Link } from "@mui/material";
import logo from "../../../utils/images/logo192.png";

function Header() {
  return (
    <Fragment>
      <HeaderContainer maxWidth="lg">
        <HeaderNav>
          <img src={logo} alt="logo" />

          <ul>
            <li>
              <Link href="/">Home</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </HeaderNav>
      </HeaderContainer>
    </Fragment>
  );
}

export default Header;
