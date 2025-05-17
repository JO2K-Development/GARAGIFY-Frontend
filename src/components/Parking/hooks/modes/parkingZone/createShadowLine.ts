import * as fabric from "fabric";

export const createShadowLine = (points: fabric.Point[]): fabric.Polyline => {
  const polygonPoints = points.map((p) => ({ x: p.x, y: p.y }));

  const line = new fabric.Polyline(polygonPoints, {
    stroke: "#0078d4",
    strokeDashArray: [5, 5],
    strokeWidth: 1,
    fill: "transparent",
    selectable: false,
    evented: false,
    objectCaching: false,
  });

  return line;
};

export default createShadowLine;