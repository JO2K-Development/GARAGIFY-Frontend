import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function getSessionToken() {
  return (await getServerSession(authOptions))?.sessionToken;
}

export function getAuthHeaders(token?: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function callBackend({
  method,
  path,
  backendClient,
  headers,
  params,
  body,
}: {
  method: "GET" | "POST" | "DELETE" | "PUT";
  path: string;
  backendClient: any;
  headers: any;
  params?: any;
  body?: any;
}) {
  try {
    const { response, data, error } = await backendClient[method](path, {
      headers,
      ...(params ? { params } : {}),
      ...(body ? { body } : {}),
    });

    console.log("Backend response", {
      status: response.status,
      ok: response.ok,
      error,
    });

    if (!response.ok) {
      return NextResponse.json(error, { status: response.status });
    }

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return data ? NextResponse.json(data) : (new NextResponse(null, { status: response.status }));
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
