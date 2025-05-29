"use client";

import { useSession } from "next-auth/react";
import { PropsWithChildren } from "react";
import LoginView from "./LoginView/LoginView";
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay";

export default function AuthWrapper({ children }: PropsWithChildren) {
  const { data: session, status } = useSession();
  if (status === "loading") return <LoadingOverlay />;
  if (!session) {
    return <LoginView />;
  }

  return children;
}
