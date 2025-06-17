import { gql } from "@apollo/client";
// Queries
export const getUser = gql`
  query GetUser {
    getUser {
      status
      message
      data {
        _id
        name
        email
        number
      }
    }
  }
`;

export const loginUser = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      message
      status
      user {
        _id
        email
        name
        number
      }
    }
  }
`;

export const registerUser = gql`
  mutation Signup($input: RegisterInput!) {
    register(input: $input) {
      status
      message
      token
      user {
        email
        name
        number
      }
    }
  }
`;


export const logoutUser = gql`
  mutation Logout {
    logout {
      message
      status
    }
  }
`;
