import { authOptions } from "@/utils/auth";
import { StatusCodes } from "http-status-codes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/../api/backendClient";

export async function POST(
  request: NextRequest,
) {
  const token = (await getServerSession(authOptions))?.sessionToken;
  const body=await request.json()

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
       "Content-Type": "application/json",
    };
    const { response,  error,data } = await backendClient.POST(
      `/api/v1/lend-offer`,
      {
        headers,
        body
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


export async function GET(
  request: NextRequest,
) {
  const token = (await getServerSession(authOptions))?.sessionToken;
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  try {
    const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
    const { response,  error,data } = await backendClient.GET(
      `/api/v1/lend-offer`,
      {
        headers,params:{
            query:params
        }
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
