import { gql } from "@apollo/client";

export const MUTATE_LOGIN_USER = gql`
  mutation UserLogin($where: userLoginWhere!) {
    userLogin(where: $where) {
      data {
        _id
        email
        firstName
        lastName
      }
      token
    }
  }
`;

export const QUERY_FILES = gql`
  query QueryFiles {
    files {
      data {
        _id
        dropLink
        actionDate
      }
    }
  }
`;
