export interface Session {
  token: string;
}

export interface User {
  email: string;
}

export interface UserSignupResponse {
  user: User;
  session: Session;
  error?: string;
}

export type UserLoginResponse = UserSignupResponse;
export interface GeneralApiError {
  error: string;
}

export interface AppState {
  isAuthenticated: false;
  user: User | null;
}
