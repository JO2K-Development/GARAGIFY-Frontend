import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useSpot } from "@/context/SpotProvider";
import { assignUser, getAllUsers, getUsers, UserWithSpots } from "@/api/admin";
import { useToast } from "@/context/ToastProvider";
type UserData = {
  userId: string;
  email: string;
};

type UseSpotAssignmentProps = {
  userData: Record<string, UserData[]>;
  selectedSpotId: string | null;
};

export const useSpotAssignment = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { selectedSpotId } = useSpot();
  const { data: users, refetch: refetchGetUsers } = useQuery({
    queryKey: ["getUsers", selectedSpotId],
    queryFn: () => {
      return getAllUsers(1);
    },
  });
  const currentOwner = users?.find((user) =>
    user.spots.some((spot) => spot.spot_uuid === selectedSpotId)
  );

  useEffect(() => {
    if (currentOwner) {
      setSelectedUserId(currentOwner.user_id);
    } else {
      setSelectedUserId(null);
    }
  }, [currentOwner]);

  const handleChange = (value: string) => {
    setSelectedUserId(value);
  };

  const mutationUser = useMutation({
    mutationFn: assignUser,
    onSuccess: (data) => {
      refetchGetUsers();
      toast.success({
        message: "Success!",
        description: "Your action was successful.",
      });
    },
    onError: (error) => {
      toast.error({
        message: "Error",
        description: "There was an error assigning the user.",
      });
    },
  });

  const onUnassign = () => {
    if (!selectedSpotId) return;
    mutationUser.mutate({
      parkingId: 1, // Replace with actual parking ID
      spotId: selectedSpotId,
      user_id: null,
    });
  };
  const toast = useToast();
  const onSubmit = () => {
    if (!(selectedSpotId && selectedUserId)) return;
  };

  return {
    owner: currentOwner,
    users: users || [],
    selectedUserId,
    setSelectedUserId,
    handleChange,
    onSubmit,
    onUnassign,
  };
};
