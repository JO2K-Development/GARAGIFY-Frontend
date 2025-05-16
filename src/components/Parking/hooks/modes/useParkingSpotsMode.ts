"use client";
import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { useCanvasContext } from "../../context/CanvasContext";
import { v4 as uuidv4 } from "uuid";
import { redrawParkingSpotGroup } from "../../utils";

export const useParkingSpotsMode = (canvas: fabric.Canvas | null) => {
  const {
    mode,
    setSelectedObject,
    addParkingSpotGroup,
    parkingSpotGroups,
    editParkingSpotGroup,
    removeParkingSpotGroup,
  } = useCanvasContext();
  const isActive = mode === "parkingSpots";

  const startPointRef = useRef<fabric.Point | null>(null);
  const previewLineRef = useRef<fabric.Line | null>(null);
  const isDraggingAnchorRef = useRef<false | "start" | "end">(false);
  const activeGroupIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!canvas || !isActive) return;

    canvas.selection = false;

    const onMouseDown = (opt: any) => {
      const evt = opt.e as MouseEvent;
      if (evt.ctrlKey) return;

      // Handle anchor dragging
      if (opt.target && opt.target.get("anchorType")) {
        isDraggingAnchorRef.current = opt.target.get("anchorType");
        activeGroupIdRef.current = opt.target.get("groupId");
        return;
      }

      // Don't draw if user is clicking on an existing object
      if (opt.target) return;

      const pointer = canvas.getPointer(evt);

      // Start drawing a new parking line
      if (!startPointRef.current) {
        startPointRef.current = new fabric.Point(pointer.x, pointer.y);
        return;
      }

      const endPoint = new fabric.Point(pointer.x, pointer.y);
      const id = uuidv4();

      // Create the parking spot group
      const angleRad = Math.atan2(
        endPoint.y - startPointRef.current.y,
        endPoint.x - startPointRef.current.x
      );
      const angleDeg = (angleRad * 180) / Math.PI;

      const spotCount = 3; // Default number of spots
      const spotSize = { width: 30, height: 50 }; // Default size

      // Create line and add to canvas
      const line = new fabric.Line(
        [
          startPointRef.current.x,
          startPointRef.current.y,
          endPoint.x,
          endPoint.y,
        ],
        {
          stroke: "black",
          strokeWidth: 2,
          hasControls: false,
          hasBorders: false,
          lockScalingX: true,
          lockScalingY: true,
          lockRotation: true,
          selectable: true,
        }
      );

      line.set("customId", id);
      line.set("groupId", id);
      line.set("objectType", "parkingLine");

      // Create group object to track in context
      const newGroup = {
        id,
        line,
        spots: [],
        spotCount,
        spotSize,
        spotAngle: angleDeg,
      };

      // Add to context
      addParkingSpotGroup(newGroup);

      // Use the redraw utility to create all the objects
      redrawParkingSpotGroup(canvas, newGroup);

      setSelectedObject(line);

      // Clear the preview and reset drawing state
      if (previewLineRef.current) {
        canvas.remove(previewLineRef.current);
        previewLineRef.current = null;
      }

      startPointRef.current = null;
    };

    const onMouseMove = (opt: any) => {
      const pointer = canvas.getPointer(opt.e);

      // Handle anchor dragging
      if (isDraggingAnchorRef.current && activeGroupIdRef.current) {
        const groupId = activeGroupIdRef.current;
        const anchorType = isDraggingAnchorRef.current;

        const group = parkingSpotGroups.find((g) => g.id === groupId);
        if (!group) return;

        // Update the line endpoint
        if (anchorType === "start") {
          group.line.set({ x1: pointer.x, y1: pointer.y });
        } else if (anchorType === "end") {
          group.line.set({ x2: pointer.x, y2: pointer.y });
        }

        // Recalculate angle
        const dx = group.line.x2! - group.line.x1!;
        const dy = group.line.y2! - group.line.y1!;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;

        // Update the group with new angle
        editParkingSpotGroup(groupId, (prev) => ({
          ...prev,
          spotAngle: angleDeg,
        }));

        // Use the utility to redraw everything
        redrawParkingSpotGroup(canvas, group);
        return;
      }

      // Handle preview line for new lines
      if (!startPointRef.current || !canvas) return;

      const endPoint = new fabric.Point(pointer.x, pointer.y);

      if (!previewLineRef.current) {
        const line = new fabric.Line(
          [
            startPointRef.current.x,
            startPointRef.current.y,
            endPoint.x,
            endPoint.y,
          ],
          {
            stroke: "#aaa",
            strokeDashArray: [5, 5],
            strokeWidth: 1,
            selectable: false,
            evented: false,
          }
        );
        previewLineRef.current = line;
        canvas.add(line);
      } else {
        previewLineRef.current.set({ x2: pointer.x, y2: pointer.y });
        previewLineRef.current.setCoords();
      }

      canvas.requestRenderAll();
    };

    const onMouseUp = () => {
      if (isDraggingAnchorRef.current) {
        isDraggingAnchorRef.current = false;
        activeGroupIdRef.current = null;
      }
    };

    const onSelect = (opt: any) => {
      const target = opt.target;
      if (!target) return;

      const groupId = target.get("groupId");
      if (!groupId) return;

      // Find all objects from this group
      const groupObjects = canvas
        .getObjects()
        .filter((obj) => obj.get("groupId") === groupId);

      // Create a selection of the objects
      canvas.discardActiveObject();
      const selection = new fabric.ActiveSelection(groupObjects, { canvas });
      canvas.setActiveObject(selection);
      canvas.requestRenderAll();
      setSelectedObject(selection);
    };

    const onModified = (opt: any) => {
      const target = opt.target;
      if (!target) return;

      // Handle group movement
      if (target.type === "activeSelection") {
        const groupId = target._objects[0]?.get("groupId");
        if (!groupId) return;

        // Find the corresponding group
        const group = parkingSpotGroups.find((g) => g.id === groupId);
        if (!group) return;

        // Force a redraw to ensure everything is properly aligned
        redrawParkingSpotGroup(canvas, group);
      }
    };

    canvas.on("object:moving", (opt) => {
      const obj = opt.target;
      if (!obj) return;

      const groupId = obj.get("groupId");
      if (!groupId || obj.get("anchorType")) return;

      // Move all objects in the group
      const dx = obj.left - (obj._originalLeft || 0);
      const dy = obj.top - (obj._originalTop || 0);

      canvas.getObjects().forEach((o) => {
        if (o.get("groupId") === groupId && o !== obj) {
          o.left += dx;
          o.top += dy;
          o.setCoords();
        }
      });

      obj._originalLeft = obj.left;
      obj._originalTop = obj.top;

      canvas.requestRenderAll();
    });

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:move", onMouseMove);
    canvas.on("mouse:up", onMouseUp);
    canvas.on("selection:created", onSelect);
    canvas.on("selection:updated", onSelect);
    canvas.on("object:modified", onModified);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:move", onMouseMove);
      canvas.off("mouse:up", onMouseUp);
      canvas.off("selection:created", onSelect);
      canvas.off("selection:updated", onSelect);
      canvas.off("object:modified", onModified);

      if (previewLineRef.current) {
        canvas.remove(previewLineRef.current);
        previewLineRef.current = null;
      }

      startPointRef.current = null;
      isDraggingAnchorRef.current = false;
      activeGroupIdRef.current = null;
      canvas.selection = true;
    };
  }, [canvas, isActive, parkingSpotGroups]);

  // If the mode changes to "view", make all objects non-selectable
  useEffect(() => {
    if (!canvas) return;

    if (mode === "view") {
      canvas.getObjects().forEach((obj) => {
        obj.selectable = false;
        // Still allow event handling for selecting parking spots
        obj.evented = true;
      });
    } else if (isActive) {
      // In parking spots mode, restore selectability
      canvas.getObjects().forEach((obj) => {
        const groupId = obj.get("groupId");
        // Only parking spot objects should be selectable in this mode
        if (groupId) {
          obj.selectable = true;
          obj.evented = true;
        }
      });
    }

    canvas.requestRenderAll();
  }, [canvas, mode, isActive]);

  // When spot count or size changes in context, redraw the spots
  useEffect(() => {
    if (!canvas || !isActive) return;

    // Get all active groups
    parkingSpotGroups.forEach((group) => {
      redrawParkingSpotGroup(canvas, group);
    });
  }, [canvas, isActive, parkingSpotGroups]);

  return {};
};
