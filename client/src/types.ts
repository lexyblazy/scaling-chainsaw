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

export interface AppState {
  isAuthenticated: false;
  user: User | null;
}

export interface Service {
  id: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  name: string;
  promoCodes: string[];
}

export type ServicesListResponse = {
  services: Service[];
  error?: string;
};

export interface PromoActivation {
  isActivated: boolean;
  codes: string[];
  selectedCode: string;
}

export type PromoActivationState = {
  [key in string]: PromoActivation;
};
export interface ServicesComponentAppState {
  services: Service[];
  searchResults: Service[];
  errorMessage: string;
  loading: boolean;
  promoActivation: PromoActivationState | null;
  searchTerm: string;
  activationloading: boolean;
}

export interface ActivatePromotionResponse {
  activationStatus: string;
  discountValue: string;
  id: string;
  promoCodeStatus: string;
  serviceName: string;
  error?: string;
  existingActivePromoActivation?: boolean;
}
