import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import ParkingLendForm from "../ParkingLendForm/ParkingLendForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";

const LendingView = () => {
  return (
    <ElevatedScreenDivider
      left={<ParkingLendForm />}
      right={<ParkingView />}
    />
  );
};
export default LendingView;
