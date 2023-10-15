import { GeographicalInformationType } from "@/utilities/api-types";
import { Roles, UserDetails } from "./User";

type AuthenticationStateType = {
  metadata: Partial<{
    current_datetime: string;
    last_login: string;
    status: "authenticated" | "unauthenticated" | "authenticating";
    token: string;
    role: Roles;
    name: string;
    geodata: GeographicalInformationType;
  }>;
  user: Partial<UserDetails>;
};

export type { AuthenticationStateType };
