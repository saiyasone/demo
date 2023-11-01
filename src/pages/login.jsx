import { Fragment, useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { MUTATE_LOGIN_USER, QUERY_FILES } from "../apollo/login";
import { Typography } from "@mui/material";

function LoginProvider() {
  const [getFile, { data: get_file }] = useLazyQuery(QUERY_FILES);
  const [userLogin, { data: user_login }] = useMutation(MUTATE_LOGIN_USER);
  const [user, setUser] = useState({});
  const [token, setToken] = useState("");

  async function loadingFile() {
    try {
      const res = await getFile();
      if (res?.data?.files) {
        // console.log(res.data.files.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function loginUser() {
    try {
      const res = await userLogin({
        variables: {
          where: {
            password: "96Es84352",
            username: "demo1",
          },
        },
      });

      if (res?.data?.userLogin) {
        setToken(res.data.userLogin.token);
        setUser(res.data.userLogin.data[0]);
        // console.log(res.data.userLogin.token);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadingFile();
  }, []);
  useEffect(() => {}, [user_login]);

  return (
    <>
      <h2>Hello World</h2>
      {token ? (
        <Fragment>
          <Typography variant="h4">Token: {token}</Typography>
          <ul>
            <li>
              {user?.firstName} {user?.lastName}{" "}
            </li>
          </ul>
        </Fragment>
      ) : null}
      <button onClick={loginUser}>Down</button>
    </>
  );
}

export default LoginProvider;
