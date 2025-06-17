import { gql } from "@apollo/client";

// --- GET_BROKER --------------------------------------------
export const GET_BROKER = gql`
  query GetBroker($actid: String!) {
    getBroker(actid: $actid) {
      status
      message
      data {
        accessToken
        actid
        lastLoginAt
        loginStatus
        broker
        userId
      }
    }
  }
`;

// --- BROKER_LOGIN ------------------------------------------
export const BROKER_LOGIN = gql`
  mutation BrokerLogin($input: BrokerPayload!) {
    loginBroker(input: $input) {
      accessToken
      redirect_uri
      message
      status
    }
  }
`;


export const GET_ALL_BROKERS = gql`
  query GetAllBrokers {
    getAllBrokers {
      status
      message
      data {
        accessToken
        actid
        broker
        lastLoginAt
        loginStatus
      }
    }
  }
`;


export const REGISTER_BROKER = gql`
  mutation RegisterBroker($input: RegisterBroker!) {
    registerBroker(input: $input) {
      data {
        accessToken
        actid
        broker
        lastLoginAt
        loginStatus
        userId
      }
      status
      message
    }
  }
`;


export const BROKER_LOGIN_MUTATION = gql`
  mutation brokerLogin($input: BrokerPayload!) {
    loginBroker(input: $input) {
      status
      redirect_uri
      message
      accessToken
    }
  }
`;


export const DELETE_BROKER_MUTATION = gql`
    mutation deleteBroker($input: RemoveBrokerInput!) {
        removeBroker(input: $input) {
            message
            status
        }
    }
`;
