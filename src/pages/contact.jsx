import { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Box, Typography, createTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { QUERY_CONTACT } from "../apollo/gql-contact";
import { isDateToday } from "../utils/date";

const theme = createTheme();
const ContactContainer = styled(Box)({
  padding: "1rem 2rem",
  backgroundColor: "limegreen",
  [theme.breakpoints.down("sm")]: {
    backgroundColor: "red",
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
          console.log(true);
        } else {
          console.log(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getContactData();
  }, [get_contact]);

  return (
    <ContactContainer>
      <Typography variant="h3">Start With Contact</Typography>
      <Box marginTop="1rem">
        <ul style={{ listStyle: "none" }}>
          {contacts.map((contact) => (
            <li key={contact._id}>
              {contact.email} {currentDate.getMonth()}
            </li>
          ))}
        </ul>
      </Box>
    </ContactContainer>
  );
}

export default Contact;
