import styles from "./page.module.css";

const SKELETON_CARD_COUNT = 6;

export function ProductGridSkeleton() {
  return (
    <ul className={styles.productGrid} aria-hidden="true">
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <li key={index}>
          <div className={styles.skeletonCard}>
            <span className={`${styles.skeletonLine} ${styles.skeletonCategory}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonDescription}`} />
            <span className={`${styles.skeletonLine} ${styles.skeletonPrice}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
