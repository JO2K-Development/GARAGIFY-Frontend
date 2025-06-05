import ElevatedScreenDivider from "@/components/ElevatedScreenDivider/ElevatedScreenDivider";
import AdminForm from "../AdminForm/AdminForm";
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
