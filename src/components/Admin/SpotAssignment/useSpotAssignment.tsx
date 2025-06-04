// hooks/useSpotAssignment.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useSpot } from "@/context/SpotProvider";
import { set } from "react-hook-form";
import { assignUser, getAllUsers, getUsers, UserWithSpots } from "@/api/admin";
import { remapMap } from "./utils";
import { showToast } from "@/utils/showToast";
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
  const {
    data: users,
    isLoading,
    error,
    refetch: refetchGetUsers,
  } = useQuery({
    queryKey: ["getUsers", selectedSpotId],
    queryFn: () => {
      return getAllUsers(1);
    },
    // enabled: false, // Don't run automatically
  });
  console.log("users", users);
  //
    const currentOwner= users?.find((user) =>
        user.spots.some((spot) => spot.spot_uuid === selectedSpotId)
    );

      useEffect(() => {
    if (currentOwner) {
        setSelectedUserId(currentOwner.user_id);
    } 
    else {
        setSelectedUserId(null);
    }
    }, [currentOwner]);

  const handleChange = (value: string) => {
    setSelectedUserId(value);
  };

  

  const mutationUser = useMutation({
    mutationFn: assignUser,
    onSuccess: (data) => {
      console.log("user assigned:", data);
      refetchGetUsers();
        toast.success({
      message: 'Success!',
      description: 'Your action was successful.',
    });
    },
    onError: (error) => {
      console.error("Error assigning user:", error);
        toast.error({
      message: 'Error',
        description: 'There was an error assigning the user.',
    });
    },
  });

  const onUnassign = () => {
    if (!(selectedSpotId)) return;
    mutationUser.mutate({
      parkingId: 1, // Replace with actual parking ID
      spotId: selectedSpotId,
      user_id: undefined, 
    });
    console.log("Unassigning user:", selectedSpotId, selectedUserId);
  }
  const toast = useToast();
  const onSubmit = () => {
    if (!(selectedSpotId && selectedUserId)) return;

    console.log("Assigning user:", selectedSpotId, selectedUserId);

  };

  return {
    owner: currentOwner,
    users : users || [],
    selectedUserId,
    setSelectedUserId,
    handleChange,
    onSubmit,
    onUnassign,
  };
};