import { useEffect } from "react";
import * as fabric from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";

type UseCanvasModeBaseOptions = {
  canvas: fabric.Canvas | null;
  modeName: string;
  onSelect?: (obj: fabric.Object | null) => void;
  onModify?: (obj: fabric.Object) => void;
  selectableFilter?: (obj: fabric.Object) => boolean;
};

const useCanvasModeBase = ({
  canvas,
  modeName,
  onSelect,
  onModify,
  selectableFilter,
}: UseCanvasModeBaseOptions) => {
  const { mode } = useCanvasContext();
  const isActive = mode === modeName;

  useEffect(() => {
    if (!canvas) return;

    const handleSelect = () => onSelect?.(canvas.getActiveObject() ?? null);
    const handleDeselect = () => onSelect?.(null);

    const handleModified = (opt: any) => {
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
  }, [canvas, isActive]);

  useEffect(() => {
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => {
      const shouldEnable = selectableFilter ? selectableFilter(obj) : isActive;
      obj.selectable = shouldEnable;
      obj.evented = shouldEnable;
    });

    canvas.requestRenderAll();
  }, [canvas, isActive]);
};

export default useCanvasModeBase;
