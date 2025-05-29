"use client";
import { createLendOffer, deleteLendOffer, getLendOffers } from "@/api/api";
import BorrowingView from "@/components/Borrowing/BorrowingView/BorrowingView";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // deleteLendOffer({ id: "123e4567-e89b-12d3-a456-426614174000" });
    getLendOffers({});
    // createLendOffer({
    //   start_date: "2028-08-03T10:00:00.000Z",
    //   end_date: "2028-09-03T12:00:00.000Z",
    //   spot_id: "123e4367-e89b-12d3-a456-426614174000",
    // });
  }, []);
  return <BorrowingView />;
}
