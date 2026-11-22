import { apiClient } from "../api-client";
import type { MemberRatingItem } from "./models";

export function getMemberRatings(memberId: number) {
  return apiClient
    .get(`members/${memberId}/ratings`)
    .json<MemberRatingItem[]>();
}
