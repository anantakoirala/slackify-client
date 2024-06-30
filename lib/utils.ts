import { restApi } from "@/api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkAuthentication = async (): Promise<boolean> => {
  let isAuthenticated = false;
  await restApi
    .get("/api/v1/auth/me")
    .then((res) => {
      isAuthenticated = true; // Set isAuthenticated based on response data
    })
    .catch((error: any) => {
      console.error("Authentication check failed:", error);
      isAuthenticated = false; // Set isAuthenticated based on error handling
    });

  return isAuthenticated;
};
