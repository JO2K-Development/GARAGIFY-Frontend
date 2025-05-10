"use client";
import { useState } from "react";
import { Rect, Group } from "react-konva";
import parkingConfig from "./mockParkingData.json";

export const GRID_CELL_SIZE = 10;
export const SHRINK_RATE = 0.95;

const ParkingPicker = () => {
  const { parking } = parkingConfig;
  const { size } = parking[0];
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const getSpotColor = (status: string) => {
    switch (status) {
      case "available":
        return "green";
      case "occupied":
        return "red";
      case "reserved":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <>
      {parking.map((area) =>
        area.spots.map((spot) => {
          const actualHeight = size.height * GRID_CELL_SIZE * SHRINK_RATE;
          const actualWidth = size.width * GRID_CELL_SIZE * SHRINK_RATE;
          const isSelected = spot.id === selectedSpotId;
          const selectedScale = isSelected ? 0.9 : 1;
          const outlineSize = 5;

          return (
            <Group
              key={spot.id}
              x={spot.x * GRID_CELL_SIZE}
              y={spot.y * GRID_CELL_SIZE}
              rotation={spot.rotation}
              onClick={() => setSelectedSpotId(spot.id)}
            >
              {isSelected && (
                <Rect
                  x={-(actualWidth * selectedScale) / 2 - outlineSize / 2}
                  y={-(actualHeight * selectedScale) / 2 - outlineSize / 2}
                  width={actualWidth * selectedScale + outlineSize}
                  height={actualHeight * selectedScale + outlineSize}
                  stroke="blue"
                  strokeWidth={outlineSize}
                />
              )}
              <Rect
                x={-(actualWidth * selectedScale) / 2}
                y={-(actualHeight * selectedScale) / 2}
                width={actualWidth * selectedScale}
                height={actualHeight * selectedScale}
                fill={getSpotColor(spot.status)}
              />
            </Group>
          );
        })
      )}
    </>
  );
};

export default ParkingPicker;
