// --- GET_BROKER types ---------------------------------------
export interface GetBrokerVariables {
    actid: string;
  }
  
  export interface GetAllBrokersResponse {
    getAllBrokers: {
      status: boolean;
      message: string;
      data: {
        accessToken: string | null;
        actid: string;
        broker: string;
        lastLoginAt: string;
        loginStatus: boolean;
      }[];
    };
  }
  
  // --- BROKER_LOGIN types -------------------------------------
  export interface BrokerPayload {
    actid: string;
    request_token?: string;
  }
  
  export interface BrokerLoginVariables {
    input: BrokerPayload;
  }
  
  export interface BrokerLoginResponse {
    loginBroker: {
      accessToken?: string;
      redirect_uri?: string;
      message: string;
      status: boolean;
    };
  }



// graphql/broker/broker.ts (add this mutation)
import { gql } from '@apollo/client';

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

// graphql/broker/types.ts (add these types)
export interface RegisterBrokerInput {
  actid: string;
  broker: string;
}

export interface RegisterBrokerResponse {
  registerBroker: {
    data: {
      accessToken: string | null;
      actid: string;
      broker: string;
      lastLoginAt: string | null;
      loginStatus: boolean;
      userId: string;
    };
    status: boolean;
    message: string;
  };
}



  