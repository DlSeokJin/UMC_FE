import { authApi } from "../auth-api";
import type { FavoriteItem } from "./get-favorites";

export interface AddFavoriteRequest {
  movieId: number;
}

export interface AddFavoriteResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: FavoriteItem;
}

export function addFavorite(body: AddFavoriteRequest) {
  return authApi
    .post("favorites", { json: body })
    .json<AddFavoriteResponse>();
}
