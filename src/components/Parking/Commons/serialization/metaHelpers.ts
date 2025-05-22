import * as fabric from "fabric";
import { FabricMeta } from "@/components/Parking/Commons/utils/constants";

export function serializeMeta(obj: fabric.Object) {
  const meta: Record<string, any> = {};
  Object.values(FabricMeta).forEach((key) => {
    const value = obj.get(key);
    if (value !== undefined) meta[key] = value;
  });
  return meta;
}

export function restoreMeta(obj: fabric.Object, plain: Record<string, any>) {
  Object.values(FabricMeta).forEach((key) => {
    if (plain[key] !== undefined) obj.set(key, plain[key]);
  });
}
