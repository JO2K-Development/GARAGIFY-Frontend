import { useMutation, useQuery } from "@tanstack/react-query";
import { getLendings } from "@/api/api";
import { deleteLend } from "@/api/parking";

const useMyLendingsView = () => {

  const fetchLendings = async () => {
    const response = await getLendings();
    const content = (await response.json()).content;
    return content.map((lending: any) => ({
      id: lending.id,
      start_date: lending.start_date,
      end_date: lending.end_date,
      parking_id: lending.parking_id,
      spot_id: lending.spot_id,
      borrowers: lending.borrowers.users.map((borrower: any) => ({
        email: borrower.email,
        user_id: borrower.user_id
      }))
    }));
  }
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["lending"],
    queryFn: () => fetchLendings(),
  });

  const mutationDeleteLending = useMutation({
    mutationFn: deleteLend,
    onSuccess: () => {
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting borrowing:", error);
    },
  });

  const onCancel = (lending_id: string) => {
    mutationDeleteLending.mutate(lending_id);
  }

  return {
    content: data ?? [],
    isLoading,
    error,
    onCancel
  };
}

export default useMyLendingsView;