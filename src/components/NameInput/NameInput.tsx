import { useState } from "react";
import styles from "./NameInput.module.css";

interface NameInputProps {
  initialValue?: string;
  onSubmit: (name: string) => void;
  buttonLabel?: string;
}

export function NameInput({
  initialValue = "",
  onSubmit,
  buttonLabel = "Start",
}: NameInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter your name"
        className={styles.input}
        maxLength={32}
        autoFocus
      />
      <button type="submit" className={styles.button} disabled={!value.trim()}>
        {buttonLabel}
      </button>
    </form>
  );
}
