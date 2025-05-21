import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { v4 as uuidv4 } from "uuid";
import createObstacle from "./createObstacle";
import { ObstacleType, Mode } from "@/components/Parking/Commons/types";
import {
  FABRIC_META,
  FabricObjectTypes,
} from "@/components/Parking/Commons/constants";
import { useEditContext } from "../../Context/useEditContext";
import useCanvasModeBase from "../canvas/useCanvasModeBase";

const useObstacleMode = (canvas?: fabric.Canvas) => {
  const { setSelectedObject, addObstacle, editObstacle, mode } =
    useEditContext();

  const placingRef = useRef(false);
  const currentType = useRef<ObstacleType>(ObstacleType.TREE);

  const setCurrentType = (type: ObstacleType) => {
    currentType.current = type;
    placingRef.current = true;
  };

  const isActive = mode === Mode.OBSTACLES;

  useEffect(() => {
    if (!canvas || !isActive) return;

    const onMouseDown = (opt: fabric.TEvent) => {
      if (!placingRef.current || !canvas) return;

      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey || canvas.findTarget(evt)) return;

      const pointer = canvas.getScenePoint(evt);
      const id = uuidv4();

      const obj = createObstacle(currentType.current, pointer);

      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();

      if (obj)
        addObstacle({ id, type: currentType.current, fabricObject: obj });
      placingRef.current = false;
    };

    canvas.on("mouse:down", onMouseDown);
    return () => canvas.off("mouse:down", onMouseDown);
  }, [canvas, isActive]);

  useCanvasModeBase({
    canvas,
    modeName: Mode.OBSTACLES,
    onSelect: setSelectedObject,
    onModify: (obj) => {
      const id = obj.get(FABRIC_META.customId);
      if (id) {
        editObstacle(id, (prev) => ({ ...prev, fabricObject: obj }));
      }
    },
    selectableFilter: (obj) =>
      obj.get(FABRIC_META.objectType) === FabricObjectTypes.Obstacle,
  });

  return { setCurrentType };
};

export default useObstacleMode;
