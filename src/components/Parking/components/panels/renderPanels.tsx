import { Canvas } from "fabric";
import { Mode, useCanvasContext } from "../../context/CanvasContext";
import ObstaclePanel from "./ObstaclePanel";
import ParkingSpotPanel from "./ParkingSpotPanel";
import ParkingZonePanel from "./ParkingZonePanel";
import { useCanvasPanning } from "../../hooks/useCanvasPanning";
import { useParkingZoneMode } from "../../hooks/modes/useParkingZoneMode";
import { useParkingSpotsMode } from "../../hooks/modes/useParkingSpotsMode";
import { useObstacleMode } from "../../hooks/modes/useObstacleMode";

interface ModePanelProps {
  canvas: Canvas;
}
const ModePanel = ({ canvas }: ModePanelProps) => {
  const { mode } = useCanvasContext();

  useCanvasPanning(canvas);
  useParkingZoneMode(canvas);
  const { setCurrentType } = useObstacleMode(canvas);
  useParkingSpotsMode(canvas);

  switch (mode) {
    case "parkingSpots":
      return canvas && <ParkingSpotPanel canvas={canvas} />;
    case "obstacles":
      return (
        canvas && <ObstaclePanel canvas={canvas} onSelect={setCurrentType} />
      );
    case "parkingZone":
      return canvas && <ParkingZonePanel canvas={canvas} />;
    default:
      return null;
  }
};

export default ModePanel;
