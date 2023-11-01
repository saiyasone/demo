import { gql } from "@apollo/client";

export const QUERY_CONTACT = gql`
  query GetContact {
    getContact {
      data {
        _id
        email
        message
      }
    }
  }
`;
