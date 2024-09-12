import { gql } from "@apollo/client";

export const MUTATE_LOGIN_USER = gql`
  mutation UserLogin($where: userLoginWhere!) {
    userLogin(where: $where) {
      token
      data {
        _id
        newName
        username
        firstName
        lastName
        packageId {
          _id
          category
          numberOfFileUpload
          downLoadOption
        }
      }
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
