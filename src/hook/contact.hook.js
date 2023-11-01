import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

export const fetchContact = () => {
  const [getContact, { data: get_contact }] = useLazyQuery(QUERY_CONTACT, {
    fetchPolicy: "no-cache",
  });

  async function getContactData() {
    try {
      const res = await getContact();
      if (res?.data) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {}, [get_contact]);
};
