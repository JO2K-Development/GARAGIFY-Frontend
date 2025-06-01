import { getSessionToken, callBackend, getAuthHeaders } from "@/utils/httpHelpers";
import { NextRequest } from "next/server";
import { backendClient } from "../../../../../../api/backendClient";

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  return callBackend({
    method: "GET",
    path: "/api/v1/borrow/mine",
    backendClient,
    headers: getAuthHeaders(token),
    params: { query: params },
  });
}