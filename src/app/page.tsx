import { Button } from "antd";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Welcome to Next.js! {process.env.BACKEND_URL}</h1>
      <Button type="primary">Test</Button>
    </div>
  );
}
