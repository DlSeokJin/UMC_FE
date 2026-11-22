import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

export function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email.trim())}`)
    .json<AvailabilityResponse>();
}
