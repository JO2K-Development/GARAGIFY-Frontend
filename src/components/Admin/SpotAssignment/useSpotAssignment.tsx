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
    const userToSpots: Map<UserData, Array<string>> = new Map<UserData, Array<string>>();
    const spotToUsers: Map<string, Array<UserData>> = new Map<string, Array<UserData>>();
    const {
        data,
        isLoading,
        error,
        refetch: refetchGetUsers,
    } = useQuery({
        queryKey: ['getUsers', selectedSpotId],
        queryFn: () => {
            return getAllUsers(1);
        },
        enabled: false, // Don't run automatically
    });

    useEffect(() => {
        refetchGetUsers().then((result) => {
            console.log("Users data:", result.data);
            const users = result.data;
            if (users)
            {    
                userToSpots.clear(); 
                spotToUsers.clear();
                users.forEach((user: UserWithSpots) => {
                    user.spots.forEach((spot) => {
                        const spotId = spot.spot_uuid;
                        const userData: UserData = {
                            userId: user.user_id,
                            email: user.email,
                        };
                        if (!userToSpots.has(userData)) {
                            userToSpots.set(userData, []);
                        }
                        if (!spotToUsers.has(spotId)) {
                            spotToUsers.set(spotId, []);
                        }
                        spotToUsers.get(spotId)!.push(userData);
                        userToSpots.get(userData)!.push(spotId);
                    });
                });

            }
        });
    }, []);

    const usersForSpot = selectedSpotId ? spotToUsers.get(selectedSpotId) : [] ;
    // console.log("Users for selected spot:", usersForSpot);
    console.log("User to spots mapping:", spotToUsers);
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
        usersForSpot: usersForSpot || [],
        selectedUserId,
        handleChange,
        onSubmit,
        userToSpots,
        spotToUsers
    };
};
