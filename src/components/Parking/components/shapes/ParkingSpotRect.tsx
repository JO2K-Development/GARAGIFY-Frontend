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
      x={x}
      y={y}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
      rotation={rotation}
      fill="green"
    />
  );
};

export default ParkingSpotRect;
