import { NextRequest } from "next/server";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { backendClient } from "@/../api/backendClient";
import { HttpMethod } from "@/utils/httpMethod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ parkingId: string }> }
) {
  const token = await getSessionToken();
  const { parkingId } = await params;
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  return callBackend({
    method: HttpMethod.GET,
    path: "/api/v1/parkings/{parking_id}/borrow/available-timeranges",
    backendClient,
    headers: getAuthHeaders(token),
    params: { path: { parking_id: Number(parkingId) },query:queryParams },
  });
}
