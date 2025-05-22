import * as fabric from "fabric";

export const createShadowLine = (points: fabric.Point[]): fabric.Polyline => {
  const polygonPoints = points.map((p) => ({ x: p.x, y: p.y }));

  const line = new fabric.Polyline(polygonPoints, {
    stroke: "#3e92f7", // a bit softer blue
    strokeDashArray: [8, 6], // longer dashes for clarity
    strokeWidth: 3,
    fill: "transparent",
    selectable: false,
    evented: false,
    objectCaching: false,
    opacity: 0.55, // semi-transparent
    strokeLineCap: "round",
    strokeLineJoin: "round",
    shadow: new fabric.Shadow({
      color: "#b5dbff",
      blur: 6,
      offsetX: 0,
      offsetY: 0,
    }),
  });

  return line;
};

export default createShadowLine;
