import { ApplicationState } from "@/redux/store";

export const clientStateSelector = (state: ApplicationState) =>
  state.client;
