"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function SessionWrapper({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
