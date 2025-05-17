import { CanvasProvider } from "../context/CanvasContext";
import ParkingCanvas from "./ParkingCanvas/ParkingCanvas";

const ParkingCanvasWrapper = () => (
  <CanvasProvider>
    <ParkingCanvas />
  </CanvasProvider>
);

export default ParkingCanvasWrapper;
