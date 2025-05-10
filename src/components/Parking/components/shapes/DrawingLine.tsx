import { Line } from "react-konva";
import { Point } from "../../utils/types";

interface DrawingLineProps {
  startPos: Point;
  currentPos: Point;
}
const DrawingLine = ({ startPos, currentPos }: DrawingLineProps) => {
  return (
    <Line
      points={[startPos.x, startPos.y, currentPos.x, currentPos.y]}
      stroke="blue"
      strokeWidth={2}
      dash={[4, 4]}
    />
  );
};

export default DrawingLine;
