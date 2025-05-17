export const FABRIC_META = {
  customId: "customId",
  groupId: "groupId",
  objectType: "objectType",
} as const;

export type FabricMetaKey = keyof typeof FABRIC_META;

export type FabricObjectType = "obstacle" | "parkingZone" | "parkingSpotGroup";

export enum FabricObjectTypes {
  Obstacle = "obstacle",
  ParkingZone = "parkingZone",
  ParkingSpotGroup = "parkingSpotGroup",
}
