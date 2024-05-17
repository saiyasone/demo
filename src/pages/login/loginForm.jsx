import { useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { MUTATE_LOGIN_USER, QUERY_FILES } from "../../apollo/login";
import { Box, Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { ButtonLogin } from "./style";
import { errorMessage, successMessage } from "../../components/messageAlert";
import { ToastContainer } from "react-toastify";

function LoginComponetForm() {
  const [getFile] = useLazyQuery(QUERY_FILES);
  const [userLogin, { data: user_login }] = useMutation(MUTATE_LOGIN_USER);

  const formSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  async function loadingFile() {
    try {
      const res = await getFile();
      if (res?.data?.files) {
        console.log(res.data.files.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function submitForm(values) {
    try {
      const res = await userLogin({
        variables: {
          where: {
            username: values.username,
            password: values.password,
          },
        },
      });

      if (res?.data?.userLogin) {
        localStorage.setItem("token", res.data.userLogin.token);
        successMessage("Login success");
        window.location = "/";
      }
    } catch (error) {
      let cutErr = error.message.replace(/(ApolloError: )?Error: /, "");
      errorMessage(cutErr);
    }
  }

  useEffect(() => {
    // loadingFile();
  }, [user_login]);

  return (
    <>
      <ToastContainer />;
      <Container
        maxWidth="md"
        style={{ marginTop: "1.5rem", overflow: "hidden" }}
      >
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={formSchema}
          onSubmit={submitForm}
        >
          {({ errors, handleSubmit, values, touched, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                id="labelUsername"
                type="text"
                label="Username"
                name="username"
                error={Boolean(touched.username && errors.username)}
                fullWidth={true}
                onChange={handleChange}
                value={values.username}
                helperText={touched.username && errors.username}
              />

              <Box mt={3}></Box>
              <TextField
                id="labelPassword"
                type="password"
                label="password"
                name="password"
                error={Boolean(touched.password && errors.password)}
                fullWidth={true}
                onChange={handleChange}
                value={values.password}
                helperText={touched.password && errors.password}
              />

              <ButtonLogin
                type="submit"
                variant="contained"
                color="success"
                fullWidth
              >
                Sign in
              </ButtonLogin>
            </form>
          )}
        </Formik>
      </Container>
    </>
  );
}

export default LoginComponetForm;
