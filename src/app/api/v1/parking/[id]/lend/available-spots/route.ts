import { NextRequest } from "next/server";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { backendClient } from "@/../api/backendClient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  const { id } = await params;
  const url = new URL(request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  return callBackend({
    method: "GET",
    path: "/api/v1/parkings/{parking_id}/lend/available-spots",
    backendClient,
    headers: getAuthHeaders(token),
    params: { path: { parking_id: Number(id) },query:queryParams },
  });
}
