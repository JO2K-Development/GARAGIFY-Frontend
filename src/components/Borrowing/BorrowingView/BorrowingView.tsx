import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingBorrowForm from "../ParkingBorrowForm/ParkingBorrowForm";
import MyBorrowingsView from "../MyBorrowingsView/MyBorrowingsView";

const BorrowingView = () => {
  return (
    <ElevatedScreenDivider
      left={ <ParkingBorrowForm/> }
      right={ <MyBorrowingsView/> }
    />
  );
};
export default BorrowingView;
