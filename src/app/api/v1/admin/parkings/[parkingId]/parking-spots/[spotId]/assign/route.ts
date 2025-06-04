import { NextRequest } from "next/server";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { backendClient } from "@/../api/backendClient";
import { HttpMethod } from "@/utils/httpMethod";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string; spotId: string }> }
) {
  const token = await getSessionToken();
  const { parkingId, spotId } = await params;
  const body = await request.json();

  return callBackend({
    method: HttpMethod.PUT,
    path: "/api/v1/admin/parkings/{parking_id}/parking-spots/{spot_id}/assign",
    backendClient,
    headers: getAuthHeaders(token),
    params: {
      path: {
        parking_id: Number(parkingId),
        spot_id: spotId,
      },
    },
    body,
  });
}
