import { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useScores } from "../../hooks/useScores";
import { usePlayer } from "../../context/PlayerContext";
import { ScoreTable } from "../../components/ScoreTable/ScoreTable";
import styles from "./ScoreboardScreen.module.css";

export function ScoreboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { playerName } = usePlayer();

  useEffect(() => {
    if (!playerName) navigate("/", { replace: true });
  }, [playerName, navigate]);
  const { scores } = useScores();

  // Compute sorted scores directly—don't store as state
  const sortedScores = useMemo(
    () => [...scores].sort((a, b) => b.score - a.score),
    [scores]
  );

  // Derive highlight ID from navigation state
  const highlightId = useMemo(() => {
    const state = location.state as { entryId?: string } | null;
    return state?.entryId;
  }, [location.state]);

  const handlePlayAgain = () => {
    navigate("/game");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className={styles.title}>Scoreboard</h1>
        <p className={styles.subtitle}>Great job, {playerName}!</p>

        {sortedScores.length > 0 ? (
          <ScoreTable entries={sortedScores} highlightId={highlightId} />
        ) : (
          <p className={styles.noScores}>No scores yet. Play to get started!</p>
        )}

        <div className={styles.buttonGroup}>
          <button className={styles.button} onClick={handlePlayAgain}>
            Play Again
          </button>
          <button
            className={`${styles.button} ${styles.secondary}`}
            onClick={handleHome}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
