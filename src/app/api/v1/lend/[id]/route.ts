import {
  getSessionToken,
  callBackend,
  getAuthHeaders,
} from "@/utils/httpHelpers";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "../../../../../../api/backendClient";
import { HttpMethod } from "@/utils/httpMethod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await getSessionToken();
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Missing lend_offer_id" },
      { status: 400 }
    );
  }
  return callBackend({
    method: HttpMethod.DELETE,
    path: "/api/v1/lend/{id}",
    backendClient,
    headers: getAuthHeaders(token),
    params: { path: { id } },
  });
}
