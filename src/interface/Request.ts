export interface VerifyRequest {
    session: string;
    user_id: string;
    code: string;
  }

  export interface LoginRequest {
    email: string;
  }