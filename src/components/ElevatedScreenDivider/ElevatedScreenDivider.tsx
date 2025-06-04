import { ReactNode } from "react";
import { Row, Col, Card } from "antd";
import styles from "./ElevatedScreenDivider.module.scss";

interface ElevatedScreenDividerProps {
  left: ReactNode;
  right: ReactNode;
}

const ElevatedScreenDivider = ({ left, right }: ElevatedScreenDividerProps) => {
  return (
    <Row className={styles.container} gutter={32}>
      <Col span={12}>
        <Card className={styles.card}>{left}</Card>
      </Col>
      <Col span={12}>
        <div className={styles.height}>{right}</div>
      </Col>
    </Row>
  );
};

export default ElevatedScreenDivider;
