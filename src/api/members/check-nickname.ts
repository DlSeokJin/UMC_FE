import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

export function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname.trim())}`)
    .json<AvailabilityResponse>();
}
