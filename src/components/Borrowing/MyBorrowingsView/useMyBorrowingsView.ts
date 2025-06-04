import { useQuery } from "@tanstack/react-query";
import { getBorrowings } from "@/api/api";

const useMyBorrowingsView = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["borrowing"],
    queryFn: () => getBorrowings(),
  });

  const onCancel = (borrowing_id: string) => {
    console.log(borrowing_id);
  }

  return {
    content: data ?? [],
    isLoading,
    error,
    onCancel
  };
}

export default useMyBorrowingsView;