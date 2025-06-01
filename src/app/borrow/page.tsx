"use client";
import { getLendTimeRanges } from "@/api/availability";
import BorrowingView from "@/components/Borrowing/BorrowingView/BorrowingView";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    getLendTimeRanges(1,
      {
        untilWhen: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      }
    )
  }, []);
  return <BorrowingView />;
}
