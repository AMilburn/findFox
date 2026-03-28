import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { PlayerProvider } from "../context/PlayerProvider";

export function TestWrapper({ children }: { children: ReactNode }) {
  return (
    <PlayerProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </PlayerProvider>
  );
}
