import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { QUERY_CONTACT } from "../apollo/gql-contact";

export function FetchContact() {
  const [getContact, { data: get_contact }] = useLazyQuery(QUERY_CONTACT, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    getContactData();
  }, [get_contact]);

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
}
