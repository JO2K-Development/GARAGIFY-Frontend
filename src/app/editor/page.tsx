"use client";
import { Button } from "antd";
import styles from "./page.module.scss";
import dynamic from "next/dynamic";

const ParkingPickerTools = dynamic(
  () => import("@/components/Parking/Editor/ParkingEditorWrapper"),
  {
    ssr: false,
  }
);

const ParkingEditor = dynamic(
  () => import("@/components/Parking/Editor/ParkingEditor"),
  {
    ssr: false,
  }
);
export default function Page() {
  return (
    <div className={styles.page}>
      {/* <ParkingPickerTools /> */}
      <ParkingPickerTools />
    </div>
  );
}
