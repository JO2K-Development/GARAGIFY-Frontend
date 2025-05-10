import { Circle } from "react-konva";
import {
  CircleAnchor as CircleAnchorName,
  ParkingLine,
  Point,
} from "../../utils/types";

interface CircleAnchorProps {
  name: CircleAnchorName;
  line: ParkingLine;
  handleDrag: (id: string, name: CircleAnchorName, pos: Point) => void;
}

const CircleAnchor = ({ name, line, handleDrag }: CircleAnchorProps) => {
  return (
    <Circle
      name={name}
      x={line[name].x}
      y={line[name].y}
      radius={8}
      fill="red"
      draggable
      onMouseDown={(e) => (e.cancelBubble = true)}
      onDragMove={(e) => {
        e.cancelBubble = true;
        const pos = e.target.position();
        handleDrag(line.id, name, pos);
      }}
    />
  );
};

export default CircleAnchor;
