"use client";
import { EditProvider } from "../Context/EditContext";
import ParkingWrapper from "../../Commons/components/ParkingWrapper/ParkingWrapper";
import EditorCanvas from "../components/EditorCanvas/EditorCanvas";
const ParkingCanvasWrapper = () => (
  <EditProvider>
    <ParkingWrapper>
      <EditorCanvas />
    </ParkingWrapper>
  </EditProvider>
);
export default ParkingCanvasWrapper;
