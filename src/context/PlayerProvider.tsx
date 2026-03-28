import { useState } from "react";
import type { ReactNode } from "react";
import { PlayerContext } from "./PlayerContext";

export function PlayerProvider({ children, initialName = "" }: { children: ReactNode; initialName?: string }) {
  const [playerName, setPlayerName] = useState(initialName);

  return (
    <PlayerContext.Provider value={{ playerName, setPlayerName }}>
      {children}
    </PlayerContext.Provider>
  );
}
