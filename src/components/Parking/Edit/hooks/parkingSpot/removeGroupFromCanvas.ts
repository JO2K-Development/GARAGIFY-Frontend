import { FABRIC_META } from "@/components/Parking/Commons/constants";
import * as fabric from "fabric";
const removeGroupFromCanvas = (groupId: string, canvas?: fabric.Canvas) => {
  canvas?.getObjects().forEach((obj) => {
    if (obj.get(FABRIC_META.groupId) === groupId) {
      canvas.remove(obj);
    }
  });
};

export default removeGroupFromCanvas;
