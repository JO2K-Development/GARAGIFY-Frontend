import AppShell from "@/components/AppShell/AppShell";
import { SpotProvider } from "@/context/SpotProvider";
import { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AppShell>
      <SpotProvider>{children}</SpotProvider>
    </AppShell>
  );
}
