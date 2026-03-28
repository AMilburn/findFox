import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "../../context/PlayerContext";
import { NameInput } from "../../components/NameInput/NameInput";
import styles from "./WelcomeScreen.module.css";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { playerName, setPlayerName } = usePlayer();
  const [isEditing, setIsEditing] = useState(!playerName);

  const handleSetName = (name: string) => {
    setPlayerName(name);
    setIsEditing(false);
  };

  const handlePlayClick = () => {
    if (playerName.trim()) {
      navigate("/game");
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <h1 className={styles.title}>Find the Fox</h1>

        {isEditing ? (
          <>
            <p className={styles.subtitle}>Enter your name</p>
            <NameInput onSubmit={handleSetName} buttonLabel="Start" />
          </>
        ) : (
          <>
            <p className={styles.greeting}>Hello, {playerName}!</p>
            <div className={styles.buttonGroup}>
              <button
                className={styles.button}
                onClick={handlePlayClick}
                disabled={!playerName.trim()}
              >
                Play
              </button>
              <button
                className={`${styles.button} ${styles.secondary}`}
                onClick={handleEditClick}
              >
                Edit Name
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
