import { NextRequest } from "next/server";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { backendClient } from "@/../api/backendClient";
import { HttpMethod } from "@/utils/httpMethod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string; spotId: string }> }
) {
  const token = await getSessionToken();
  const { parkingId, spotId } = await params;
  const body = await request.json();

  return callBackend({
    method: HttpMethod.POST,
    path: "/api/v1/parkings/{parking_id}/borrow/{spot_id}",
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
