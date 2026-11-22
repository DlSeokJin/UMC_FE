import { authApi } from "../auth-api";
import type { MemberRatingItem } from "../members/models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  comment?: string;
}

export interface UpdateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRatingItem;
}

export function updateRating({
  ratingId,
  score,
  comment,
}: UpdateRatingRequest) {
  return authApi
    .patch(`ratings/${ratingId}`, { json: { score, comment } })
    .json<UpdateRatingResponse>();
}
