import { NextRequest } from "next/server";
import { backendClient } from "../../../../../../api/backendClient";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  const { id } = await params;
  return callBackend({
    method: "GET",
    path: "/api/v1/parkings/{parking_id}",
    backendClient,
    headers: getAuthHeaders(token),
    params: { path: { parking_id: Number(id) } },
  });
}
