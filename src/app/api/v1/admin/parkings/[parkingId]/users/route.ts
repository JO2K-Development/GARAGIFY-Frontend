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
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const token = await getSessionToken();
  const { parkingId } = await params;

  return callBackend({
    method: HttpMethod.GET,
    path: "/api/v1/admin/parkings/{parking_id}/users",
    backendClient,
    headers: getAuthHeaders(token),
    params: {
      query: queryParams,
      path: {
        parking_id: Number(parkingId),
      },
    },
  });
}
