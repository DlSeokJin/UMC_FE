export interface AvailabilityResponse {
  available: boolean;
}

export interface MemberRatingItem {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
