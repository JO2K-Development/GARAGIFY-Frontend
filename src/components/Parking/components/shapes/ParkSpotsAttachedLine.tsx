import { Line } from "react-konva";
import { AttachedPoints } from "../../utils/types";

interface ParkSpotAttachedLineProps {
  isSelected: boolean;
  attachedPoints: AttachedPoints;
}
const ParkSpotAttachedLine = ({
  isSelected,
  attachedPoints,
}: ParkSpotAttachedLineProps) => {
  return (
    <Line
      draggable={false}
      name="line"
      points={[
        attachedPoints.start.x,
        attachedPoints.start.y,
        attachedPoints.end.x,
        attachedPoints.end.y,
      ]}
      stroke={isSelected ? "blue" : "gray"}
      strokeWidth={2}
    />
  );
};
export default ParkSpotAttachedLine;
