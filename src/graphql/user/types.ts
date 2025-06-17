export interface LoginVariables {
    input: {
      emailOrNumber: string;
      password: string;
    };
  }

  export interface RegisterInput {
    email: string;
    name: string;
    number: string;
    password: string;
    confirm_password: string;
  }
  
  export interface RegisterVariables {
    input: RegisterInput;
  }
  
  export interface RegisterResponse {
    register: {
      status: string | boolean;
      message: string;
      token: string;
      user: {
        email: string;
        name: string;
        number: string;
      };
    };
  }