import { authApi } from "../auth-api";
import type { MemberRatingItem } from "../members/models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment?: string;
}

export interface CreateRatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: MemberRatingItem;
}

export function createRating(body: CreateRatingRequest) {
  return authApi
    .post("ratings", { json: body })
    .json<CreateRatingResponse>();
}
