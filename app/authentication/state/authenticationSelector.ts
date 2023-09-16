import { ApplicationState } from "@/redux/store";

export const authenticationSelector = (state: ApplicationState) =>
  state.authentication;
