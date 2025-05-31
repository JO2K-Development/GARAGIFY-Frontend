import { NextRequest } from "next/server";
import { backendClient } from "@/../api/backendClient";
import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";

export async function POST(request: NextRequest) {
  const token = await getSessionToken();
  const body = await request.json();

  return callBackend({
    method: "POST",
    path: "/api/v1/lend-offer",
    backendClient,
    headers: getAuthHeaders(token),
    body,
  });
}

export async function GET(request: NextRequest) {
  const token = await getSessionToken();
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());

  return callBackend({
    method: "GET",
    path: "/api/v1/lend-offer",
    backendClient,
    headers: getAuthHeaders(token),
    params: { query: params },
  });
}
