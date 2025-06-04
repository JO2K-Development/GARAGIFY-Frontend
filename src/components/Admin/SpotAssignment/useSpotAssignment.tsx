// hooks/useSpotAssignment.ts
import { useMutation } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import { useSpot } from "@/context/SpotProvider";
import { set } from "react-hook-form";
type UserData = {
  userId: string;
  email: string;
};

type UseSpotAssignmentProps = {
  userData: Record<string, UserData[]>;
  selectedSpotId: string | null;
};

export const useSpotAssignment = ({ userData, selectedSpotId }: UseSpotAssignmentProps) => {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const usersForSpot = useMemo(() => {
        if (!selectedSpotId) return [];
        return userData[selectedSpotId] || [];
    }, [selectedSpotId, userData]);

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

    const onSubmit = () => {
        if (!(selectedSpotId && selectedUserId)) return;

        // handleSubmitBorrowPost({
        //     from: mergeDateAndTime(startDate, data.startTime),
        //     until: mergeDateAndTime(endDate, data.endTime),
        // });
    };


    return {
        usersForSpot,
        selectedUserId,
        handleChange,
        onSubmit,
    };
};
