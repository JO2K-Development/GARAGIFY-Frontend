"use client";
import { useState } from "react";
import { Image, Rect, Group } from "react-konva";
import useImage from "use-image";
import parkingConfig from "./mockParkingData.json";

export const GRID_CELL_SIZE = 10;
export const SHRINK_RATE = 0.95;
export const TILE_SIZE_MULTIPLIER = 2;

const ParkingPicker = () => {
  const { spotHeight, backgroundZones, spots } = parkingConfig;
  const [emptySpotImage] = useImage("/images/emptySpot.svg");
  const [reservedImage] = useImage("/images/schoolParking.svg");
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  const actualHeight = spotHeight * GRID_CELL_SIZE * SHRINK_RATE;
  const actualWidth = actualHeight * 2;

  return (
    <>
      {/* Background tiles */}
      {backgroundZones.flatMap((zone, zoneIndex) => {
        const tilesX = Math.ceil(zone.width / TILE_SIZE_MULTIPLIER);
        const tilesY = Math.ceil(zone.height / TILE_SIZE_MULTIPLIER);

        const tileWidth = GRID_CELL_SIZE * TILE_SIZE_MULTIPLIER;
        const tileHeight = GRID_CELL_SIZE * TILE_SIZE_MULTIPLIER;

        return Array.from({ length: tilesX * tilesY }, (_, index) => {
          const i = index % tilesX;
          const j = Math.floor(index / tilesX);
          const [texture] = useImage(`/images/${zone.textureKey}.jpeg`);
          return (
            <Image
              key={`zone-${zoneIndex}-tile-${i}-${j}`}
              x={(zone.x + i * TILE_SIZE_MULTIPLIER) * GRID_CELL_SIZE}
              y={(zone.y + j * TILE_SIZE_MULTIPLIER) * GRID_CELL_SIZE}
              width={tileWidth}
              height={tileHeight}
              image={texture}
            />
          );
        });
      })}

      {/* Parking spots */}
      {spots.map((spot) => {
        const isSelected = spot.id === selectedSpotId;
        const selectedScale = isSelected ? 0.9 : 1; // scale down if selected
        const outlineSize = 5; // outline thickness

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
                stroke="red"
                strokeWidth={outlineSize}
              />
            )}
            <Image
              width={actualWidth * selectedScale}
              height={actualHeight * selectedScale}
              offsetX={(actualWidth * selectedScale) / 2}
              offsetY={(actualHeight * selectedScale) / 2}
              image={
                spot.status === "available" ? emptySpotImage : reservedImage
              }
            />
          </Group>
        );
      })}
    </>
  );
};

export default ParkingPicker;
