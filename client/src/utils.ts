import { Session } from "./types";
import { USER_LABEL, SESSION_LABEL } from "./consts";

export const auth = {
  isAuthenticated: () => {
    const user = JSON.parse(localStorage.getItem(USER_LABEL)!);
    const session = JSON.parse(localStorage.getItem(SESSION_LABEL)!);

    if (user && session) {
      return true;
    }

    return false;
  },

  getToken: () => {
    const session: Session | null = JSON.parse(
      localStorage.getItem(SESSION_LABEL)!
    );

    return session?.token;
  },

  logout: () => {
    localStorage.removeItem(USER_LABEL);
    localStorage.removeItem(SESSION_LABEL);
  },
};

export const isValidEmail = (email: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
