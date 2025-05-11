import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingBorrowForm from "../ParkingBorrowForm/ParkingBorrowForm";

const BorrowingView = () => {
  return (
    <ElevatedScreenDivider
      left={<ParkingBorrowForm />}
      right={<div>rest</div>}
    />
  );
};
export default BorrowingView;
