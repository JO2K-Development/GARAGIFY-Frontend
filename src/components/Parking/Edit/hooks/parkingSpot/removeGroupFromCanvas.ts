import { FabricMeta } from "@/components/Parking/Commons/utils/constants";
import WithCanvas from "@/components/Parking/Commons/utils/WithCanvas";
interface RemoveGroupFromCanvasProps {
  groupId: string;
}
const removeGroupFromCanvas = ({
  canvas,
  groupId,
}: WithCanvas<RemoveGroupFromCanvasProps>) => {
  canvas?.getObjects().forEach((obj) => {
    if (obj.get(FabricMeta.GROUP_ID) === groupId) {
      canvas.remove(obj);
    }
  });
};

export default removeGroupFromCanvas;
