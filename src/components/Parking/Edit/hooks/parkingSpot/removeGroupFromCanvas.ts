import { FABRIC_META } from "@/components/Parking/Commons/constants";
import WithCanvas from "@/components/Parking/Commons/utils/WithCanvas";
interface RemoveGroupFromCanvasProps {
  groupId: string;
}
const removeGroupFromCanvas = ({
  canvas,
  groupId,
}: WithCanvas<RemoveGroupFromCanvasProps>) => {
  canvas?.getObjects().forEach((obj) => {
    if (obj.get(FABRIC_META.groupId) === groupId) {
      canvas.remove(obj);
    }
  });
};

export default removeGroupFromCanvas;
