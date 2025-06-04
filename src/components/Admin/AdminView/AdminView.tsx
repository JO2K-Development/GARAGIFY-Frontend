import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import AdminForm from "../AdminForm/AdminForm";
import ParkingView from "@/components/Parking/View/ParkingView/ParkingView";

const AdminView = () => {
  return (
    <ElevatedScreenDivider
      left={<AdminForm />}
      right={<p></p>}
    />
  );
};
export default AdminView;
