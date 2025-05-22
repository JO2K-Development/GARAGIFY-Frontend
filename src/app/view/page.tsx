import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
import styles from "./page.module.scss";
export default function Page() {
  return (
    <div className={styles.page}>
      <ParkingView />
    </div>
  );
}
