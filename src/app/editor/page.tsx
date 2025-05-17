"use client";
import dynamic from "next/dynamic";

const Parking = dynamic(() => import("@/components/Parking/Parking"), {
  ssr: false,
});

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
      <Parking />
    </div>
  );
}
