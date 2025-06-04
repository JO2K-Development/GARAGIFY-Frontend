import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import AdminForm from "../AdminForm/AdminForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";
import SpotAssignment from "../SpotAssignment/SpotAssignment";

const AdminView = () => {
  return (
    <ElevatedScreenDivider
      left={<AdminForm />}
      right={<SpotAssignment />}
    />
  );
};
export default AdminView;
