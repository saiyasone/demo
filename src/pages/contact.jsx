import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  createTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { QUERY_CONTACT } from "../apollo/gql-contact";
import { isDateToday } from "../utils/date";
import Header from "../components/layouts/header";
import axios from "axios";
import streamSaver from "streamsaver";

const theme = createTheme();
const ContactContainer = styled(Box)({
  padding: "1rem 2rem",
  [theme.breakpoints.down("sm")]: {
    // backgroundColor: "red",
  },
});

function Contact() {
  let currentDate = new Date();
  const wasabiEndpoint = "http://192.168.100.100:4002";
  const [getContact, { data: get_contact }] = useLazyQuery(QUERY_CONTACT);
  const [contacts, setContact] = useState([]);
  const [loading, setLoading] = useState(false);

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
      const endpoint = `${wasabiEndpoint}/api/file/download-file?path=bob_dev/aa.png`;

      setLoading(true);
      const response = await fetch(endpoint);
      const fileStream = await streamSaver.createWriteStream("file.png");
      await response.body.pipeTo(fileStream).then(() => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDownloadFolder = async () => {
    try {
      const endpoint = `${wasabiEndpoint}/api/file/download-folders?path=bob_dev/download`;

      setLoading(true);
      const response = await fetch(endpoint);
      const fileStream = await streamSaver.createWriteStream("folder.zip", {});
      await response.body.pipeTo(fileStream).then(() => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDownloadMultiple = async () => {
    setLoading(true);
    const multipleData = [
      "bob_dev/aa.png",
      "bob_dev/bb.png",
      "bob_dev/download/ff.png",
      "bob_dev/download/ee.png",
      "bob_dev/download-1/cc-bb.png",
      "bob_dev/download-1/cc-dd.png",
    ];
    const endpoint =
      `${wasabiEndpoint}/api/file/download-multifiles?path=` +
      JSON.stringify(multipleData);
    try {
      const response = await fetch(endpoint);
      const zipStream = await streamSaver.createWriteStream("multiple.zip");

      await response.body.pipeTo(zipStream).then(() => {
        setLoading(false);
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleDownloadMultipleFolder = async () => {
    setLoading(true);
    const multipleData = ["bob_dev/download", "bob_dev/download-1"];
    const endpoint =
      `${wasabiEndpoint}/api/file/download-folders-and-files?path=` +
      JSON.stringify(multipleData);
    try {
      const response = await fetch(endpoint);
      console.log(response);
      const zipStream = await streamSaver.createWriteStream("multiple.zip");

      await response.body.pipeTo(zipStream).then(() => {
        setLoading(false);
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

        {loading && <CircularProgress size={20} />}
        <Box sx={{ display: "flex", gap: "1rem", mt: 2 }}>
          <Button variant="contained" onClick={handleDownloadFile}>
            Download file
          </Button>

          <Button variant="contained" onClick={handleDownloadFolder}>
            Download folder
          </Button>

          <Button variant="contained" onClick={handleDownloadMultiple}>
            Download multiple file
          </Button>

          <Button variant="contained" onClick={handleDownloadMultipleFolder}>
            Download multiple folder
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
