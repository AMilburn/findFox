import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useImageQueue } from "../../hooks/useImageQueue";
import { useScores } from "../../hooks/useScores";
import { usePlayer } from "../../context/PlayerContext";
import { Grid } from "../../components/Grid/Grid";
import { Timer } from "../../components/Timer/Timer";
import { ScoreDisplay } from "../../components/ScoreDisplay/ScoreDisplay";
import { CELL_TYPE } from "../../utils/constants";
import type { CellType } from "../../types";
import styles from "./GameScreen.module.css";

const GAME_DURATION = 30;

export function GameScreen() {
  const navigate = useNavigate();
  const { playerName } = usePlayer();
  const { addScore } = useScores();
  const { currentBatch, advanceBatch } = useImageQueue();
  const [score, setScore] = useState(0);
  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    if (!playerName) navigate("/", { replace: true });
  }, [playerName, navigate]);
  const gameEndedRef = useRef(false);
  const clickLockedRef = useRef(false);
  const scoreRef = useRef(score);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  const onExpire = useCallback(() => {
    if (gameEndedRef.current) return;
    gameEndedRef.current = true;
    setHasExpired(true);

    const entryId = crypto.randomUUID();
    addScore({
      id: entryId,
      name: playerName,
      score: scoreRef.current,
      date: new Date().toISOString(),
    });

    setTimeout(() => {
      navigate("/scoreboard", { state: { entryId } });
    }, 100);
  }, [playerName, addScore, navigate]);

  useEffect(() => {
    clickLockedRef.current = false;
  }, [currentBatch]);

  const handleCellClick = useCallback((type: CellType) => {
    if (type === CELL_TYPE.FOX) {
      if (clickLockedRef.current) return;
      const advanced = advanceBatch();
      if (advanced) {
        clickLockedRef.current = true;
        setScore((s) => s + 1);
      }
    } else {
      setScore((s) => Math.max(0, s - 1));
    }
  }, [advanceBatch]);

  if (!currentBatch) {
    return (
      <div className={styles.screen}>
        <div className={styles.loadingContainer}>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Timer duration={GAME_DURATION} onExpire={onExpire} />
          <ScoreDisplay score={score} />
        </div>

        <Grid
          cells={currentBatch.cells}
          onCellClick={handleCellClick}
          disabled={hasExpired}
        />

        <p className={styles.instruction}>
          Find and click the fox as many times as you can!
        </p>
      </div>
    </div>
  );
}
