import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite } from "../api/favorites/add-favorite";
import type { FavoriteStatus } from "../api/favorites/get-favorite-status";
import { removeFavorite } from "../api/favorites/remove-favorite";

export function useAddFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => addFavorite({ movieId }),
    onSuccess: (response) => {
      queryClient.setQueryData<FavoriteStatus>(["favorites", movieId], {
        isFavorite: true,
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert(response.message);
    },
    onError: () => {
      alert("즐겨찾기 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useRemoveFavoriteMutation(movieId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => removeFavorite(movieId),
    onSuccess: (response) => {
      queryClient.setQueryData<FavoriteStatus>(["favorites", movieId], {
        isFavorite: false,
      });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert(response.message);
    },
    onError: () => {
      alert("즐겨찾기 해제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
