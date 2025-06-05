import { useMutation, useQuery } from "@tanstack/react-query";
import { getBorrowings } from "@/api/api"
import { deleteBorrow } from "@/api/parking";
import { useToast } from "@/context/ToastProvider";

const useMyBorrowingsView = () => {

  const toast = useToast();

  const fetchBorrowings = async () => {
    const response = await getBorrowings();
    const content = (await response.json()).content;
    return content.map((borrowing: any) => ({
      id: borrowing.id,
      start_date: borrowing.start_date,
      end_date: borrowing.end_date,
      parking_id: borrowing.parking_id,
      spot_id: borrowing.spot_id,
      owner: borrowing.parking_spot_owner,
    }))
  }

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["borrowing"],
    queryFn: () => fetchBorrowings(),
  });

  const mutationDeleteBorrowing = useMutation({
    mutationFn: deleteBorrow,
    onSuccess: () => {
      refetch();
      toast.success({
        message: "Cancelled borrowing successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting borrowing:", error);
      toast.error({
        message: "Failed to cancel borrowing.",
      });
    },
  });

  const onCancel = (borrowing_id: string) => {
    mutationDeleteBorrowing.mutate(borrowing_id);
  }

  return {
    content: data ?? [],
    isLoading,
    error,
    onCancel
  };
}

export default useMyBorrowingsView;