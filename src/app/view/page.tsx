"use client";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
import dynamic from "next/dynamic";

export default function Page() {
  return (
    <div
      style={{
        margin: 20,
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <ParkingView />
    </div>
  );
}
