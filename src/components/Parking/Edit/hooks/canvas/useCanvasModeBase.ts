import { useEffect } from "react";
import * as fabric from "fabric";
import { useEditContext } from "../../Context/useEditContext";
import { useCanvas } from "@/components/Parking/Commons/context/CanvasContext";

interface UseCanvasModeBaseOptions {
  modeName: string;
  onSelect?: (obj: fabric.Object | null) => void;
  onModify?: (obj: fabric.Object) => void;
  selectableFilter?: (obj: fabric.Object) => boolean;
}

const useCanvasModeBase = ({
  modeName,
  onSelect,
  onModify,
  selectableFilter,
}: UseCanvasModeBaseOptions) => {
  const { canvas } = useCanvas();
  const { mode } = useEditContext();
  const isActive = mode === modeName;

  useEffect(() => {
    if (!canvas) return;

    const handleSelect = () => onSelect?.(canvas.getActiveObject() ?? null);
    const handleDeselect = () => onSelect?.(null);

    const handleModified = (opt: any) => { // eslint-disable-line
      const obj = opt.target;
      if (obj) onModify?.(obj);
    };

    canvas.on("selection:created", handleSelect);
    canvas.on("selection:updated", handleSelect);
    canvas.on("selection:cleared", handleDeselect);
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("selection:created", handleSelect);
      canvas.off("selection:updated", handleSelect);
      canvas.off("selection:cleared", handleDeselect);
      canvas.off("object:modified", handleModified);
    };
  }, [canvas, isActive]); // eslint-disable-line

  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => { // eslint-disable-line
      const shouldEnable = selectableFilter ? selectableFilter(obj) : isActive;
      obj.selectable = shouldEnable;
      obj.evented = shouldEnable;
    });

    canvas.requestRenderAll();
  }, [canvas, isActive]); // eslint-disable-line
};

export default useCanvasModeBase;
