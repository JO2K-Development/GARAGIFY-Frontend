// hooks/useSpotAssignment.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useSpot } from "@/context/SpotProvider";
import { set } from "react-hook-form";
import { assignUser, getAllUsers, getUsers, UserWithSpots } from "@/api/admin";
import { remapMap } from "./utils";
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

  // const mutationLendSpot = useMutation({
  //     mutationFn: borrowSpot,
  //     onSuccess: (data) => {
  //     console.log("Lend offer created:", data);
  //     },
  //     onError: (error) => {
  //     console.error("Error creating lend offer:", error);
  //     },
  // });

  const mutationUser = useMutation({
    mutationFn: assignUser,
    onSuccess: (data) => {
      console.log("Lend offer created:", data);
      refetchGetUsers();
    },
    onError: (error) => {
      console.error("Error creating lend offer:", error);
    },
  });

  const onSubmit = () => {
    if (!(selectedSpotId && selectedUserId)) return;
    mutationUser.mutate({
      parkingId: 1, // Replace with actual parking ID
      spotId: selectedSpotId,
      user_id: selectedUserId,
    });
    
    // handleSubmitBorrowPost({
    //     from: mergeDateAndTime(startDate, data.startTime),
    //     until: mergeDateAndTime(endDate, data.endTime),
    // });
  };

  return {
    owner: currentOwner,
    users : users || [],
    selectedUserId,
    handleChange,
    onSubmit,
  };
};