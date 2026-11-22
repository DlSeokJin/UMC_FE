import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRating } from "../api/ratings/create-rating";
import { deleteRating } from "../api/ratings/delete-rating";
import { updateRating } from "../api/ratings/update-rating";

export function useCreateRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRating,
    onSuccess: (response) => {
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["members", memberId, "ratings"],
        });
      }
      alert(response.message);
    },
    onError: () => {
      alert("평점 등록에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useUpdateRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRating,
    onSuccess: (response) => {
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["members", memberId, "ratings"],
        });
      }
      alert(response.message);
    },
    onError: () => {
      alert("평점 수정에 실패했어요. 다시 시도해 주세요.");
    },
  });
}

export function useDeleteRatingMutation(memberId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRating,
    onSuccess: (response) => {
      if (memberId) {
        queryClient.invalidateQueries({
          queryKey: ["members", memberId, "ratings"],
        });
      }
      alert(response.message);
    },
    onError: () => {
      alert("평점 삭제에 실패했어요. 다시 시도해 주세요.");
    },
  });
}
