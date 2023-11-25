import styles from "./page.module.css";
import LogViewer from "./utils/log_viewer";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 style={{ marginBottom: "30px" }}>Query Interface</h1>
      <LogViewer />
    </main>
  );
}
