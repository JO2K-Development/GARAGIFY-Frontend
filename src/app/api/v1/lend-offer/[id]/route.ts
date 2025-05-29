import { authOptions } from "@/utils/auth";
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/../api/backendClient";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = (await getServerSession(authOptions))?.sessionToken;
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "Missing lend_offer_id" },
      { status: StatusCodes.BAD_REQUEST }
    );
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const { response, data, error } = await backendClient.DELETE(
      `/api/v1/lend-offer/{lend_offer_id}`,
      {
        params: { path: { lend_offer_id: id } },
        headers,
      }
    );
    console.log("Backend response", {
      status: response.status,
      ok: response.ok,
      error,
    });
    if (!response.ok) {
      return NextResponse.json(error, { status: response.status });
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
