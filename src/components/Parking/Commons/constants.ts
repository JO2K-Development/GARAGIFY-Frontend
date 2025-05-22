export const FabricMeta = {
  OBJECT_ID: "objectId",
  GROUP_ID: "groupId",
  OBJECT_TYPE: "objectType",
  SPOT_ID: "spotId",
} as const;

export enum FabricObjectTypes {
  OBSTACLE = "obstacle",
  PARKING_ZONE = "parkingZone",
  PARKING_GROUP = "parkingGroup",
  ANCHOR = "anchor",
}