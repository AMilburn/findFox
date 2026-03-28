import { createContext, useContext } from "react";

export interface PlayerContextValue {
  playerName: string;
  setPlayerName: (name: string) => void;
}

export const PlayerContext = createContext<PlayerContextValue | undefined>(undefined);

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
