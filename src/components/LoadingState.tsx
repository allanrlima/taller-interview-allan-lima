import styles from "./StatusState.module.css";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading…" }: LoadingStateProps) {
  return (
    <div
      className={styles.state}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className={styles.spinner} aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
