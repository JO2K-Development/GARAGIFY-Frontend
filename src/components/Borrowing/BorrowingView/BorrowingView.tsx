import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingBorrowForm from "../ParkingBorrowForm/ParkingBorrowForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";

const BorrowingView = () => {
  return (
    <ElevatedScreenDivider
      left={<ParkingBorrowForm />}
      right={<p></p>}
    />
  );
};
export default BorrowingView;
