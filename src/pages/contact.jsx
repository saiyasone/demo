import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Box, Button, Typography, createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { QUERY_CONTACT } from "../apollo/gql-contact";
import { isDateToday } from "../utils/date";
import Header from "../components/layouts/header";
import axios from "axios";

const theme = createTheme();
const ContactContainer = styled(Box)({
  padding: "1rem 2rem",
  [theme.breakpoints.down("sm")]: {
    // backgroundColor: "red",
  },
});

function Contact() {
  let currentDate = new Date();
  const [getContact, { data: get_contact }] = useLazyQuery(QUERY_CONTACT);
  const [contacts, setContact] = useState([]);

  async function getContactData() {
    try {
      const res = await getContact();
      if (res?.data?.getContact) {
        setContact(res.data.getContact.data);
        const useDate = isDateToday(currentDate.getDate() - 1);
        if (useDate) {
          // console.log(true);
        } else {
          // console.log(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDownloadFile = async () => {
    try {
      const res = await axios.get(
        "http://192.168.100.100:4002/api/file/download-file?path=bebe/bebe.png"
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "test.png");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getContactData();
  }, [get_contact]);

  return (
    <>
      <Header />
      <ContactContainer>
        <Typography variant="h3">Start With Contact</Typography>

        <Box sx={{ display: "flex", gap: "1rem", mt: 2 }}>
          <Button variant="contained" onClick={handleDownloadFile}>
            Download file
          </Button>
          <Button variant="contained" onClick={handleDownloadFile}>
            Download folder
          </Button>
        </Box>
        <Box marginTop="1rem">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {contacts.map((contact) => (
              <li key={contact._id} style={{ lineHeight: 1.6 }}>
                {contact.email} {currentDate.getMonth()}
              </li>
            ))}
          </ul>
        </Box>
      </ContactContainer>
    </>
  );
}

export default Contact;
