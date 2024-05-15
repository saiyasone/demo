import { gql } from "@apollo/client";

export const UPLOAD_FILE = gql`
  mutation CreateFiles($data: FilesInput!) {
    createFiles(data: $data) {
      _id
      path
    }
  }
`;
