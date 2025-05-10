import { Rect } from "react-konva";
import { ParkingLineSpotConfig, ParkingSpot } from "../../utils/types";
import { GRID_CELL_SIZE } from "@/components/ParkingPicker/ParkingPicker";

interface ParkingSpotRectProps {
  spot: ParkingSpot;
  lineConfig: ParkingLineSpotConfig;
}
const ParkingSpotRect = ({ spot, lineConfig }: ParkingSpotRectProps) => {
  const { id, x, y } = spot;
  const { width, height, rotation } = lineConfig;
  return (
    <Rect
      draggable={false}
      name="spot"
      key={id}
      x={x * GRID_CELL_SIZE}
      y={y * GRID_CELL_SIZE}
      width={width * GRID_CELL_SIZE}
      height={height * GRID_CELL_SIZE}
      offsetX={(width * GRID_CELL_SIZE) / 2}
      offsetY={(height * GRID_CELL_SIZE) / 2}
      rotation={rotation}
      fill="green"
    />
  );
};

export default ParkingSpotRect;
