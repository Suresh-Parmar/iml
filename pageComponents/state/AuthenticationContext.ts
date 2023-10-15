import { createContext } from "react";
import { AuthenticationStateType } from "../authTypes";

export const AuthenticationContext = createContext<AuthenticationStateType>({
  metadata: {},
  user: {},
});
