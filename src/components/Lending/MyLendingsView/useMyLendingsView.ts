import { useQuery } from "@tanstack/react-query";
import { getLendings } from "@/api/api";

const useMyLendingsView = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["lending"],
    queryFn: () => getLendings(),
  });

  const onCancel = (lending_id: string) => {
    console.log(lending_id);
  }

  return {
    content: data ?? [],
    isLoading,
    error,
    onCancel
  };
}

export default useMyLendingsView;