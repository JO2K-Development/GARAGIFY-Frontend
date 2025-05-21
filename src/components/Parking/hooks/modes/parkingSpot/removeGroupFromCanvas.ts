import { FABRIC_META } from "@/components/Parking/constants";
import * as fabric from "fabric";
const removeGroupFromCanvas = (
  canvas: fabric.Canvas | null,
  groupId: string
) => {
  canvas?.getObjects().forEach((obj) => {
    if (obj.get(FABRIC_META.groupId) === groupId) {
      canvas.remove(obj);
    }
  });
};

export default removeGroupFromCanvas;
