export interface VerifyRequest {
  session: string;
  userId: string;
  code: string;
}

export interface LoginRequest {
  email: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    AccessToken: string;
    ExpiresIn: number;
    TokenType: string;
    IdToken: string;
  };
  message: string[];
  error: null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

