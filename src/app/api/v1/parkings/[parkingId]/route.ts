import { NextRequest } from "next/server";
import { backendClient } from "@/../api/backendClient";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { HttpMethod } from "@/utils/httpMethod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> }
) {
  const token = await getSessionToken();
  const { parkingId } = await params;
  return callBackend({
    method: HttpMethod.GET, 
    path: "/api/v1/parkings/{parking_id}",
    backendClient,
    headers: getAuthHeaders(token),
    params: { path: { parking_id: Number(parkingId) } },
  });
}
