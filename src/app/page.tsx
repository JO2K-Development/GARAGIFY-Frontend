"use client";
import { Button } from "antd";
import styles from "./page.module.scss";
import dynamic from "next/dynamic";

const ParkingPickerTools = dynamic(
  () => import("@/components/ParkingPickerTools/ParkingPickerTools"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <div className={styles.page}>
      <ParkingPickerTools />
    </div>
  );
}
