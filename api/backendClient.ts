import createClient from "openapi-fetch";
import { paths, components } from "@/../api/schema";
export const backendClient = createClient<paths>({
  baseUrl: process.env.BACKEND_URL,
});

export const login = async (
  body: components["schemas"]["TokenVerificationForm"]
) =>
  await backendClient.POST("/api/v1/auth/access", {
    body,
  });

export const refreshToken = async (
  body: components["schemas"]["TokenVerificationForm"]
) =>
  await backendClient.POST("/api/v1/auth/refresh", {
    body,
  });
