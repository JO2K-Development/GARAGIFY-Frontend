import { EditProvider } from "../Context/EditContext";
import ParkingCanvas from "../../Commons/components/ParkingCanvas/ParkingCanvas";
const ParkingCanvasWrapper = () => (
  <EditProvider>
    <ParkingCanvas />
  </EditProvider>
);

export default ParkingCanvasWrapper;
