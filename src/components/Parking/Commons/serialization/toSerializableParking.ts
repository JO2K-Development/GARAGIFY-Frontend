import { ParkingMap } from "../utils/types";

const toSerializableParking = (parking: ParkingMap) => ({
  ...parking,
  zones: parking.zones.map((z) => ({
    ...z,
    fabricObject: z.fabricObject.toObject(),
  })),
  obstacles: parking.obstacles.map((o) => ({
    ...o,
    fabricObject: o.fabricObject.toObject(),
  })),
  spotGroups: parking.spotGroups.map((g) => ({
    ...g,
    line: g.line.toObject(),
    spots: g.spots.map((s) => s.toObject()),
  })),
});

export default toSerializableParking;
