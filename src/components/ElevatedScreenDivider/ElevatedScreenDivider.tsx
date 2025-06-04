import { ReactNode } from "react";
import { Row, Col, Card } from "antd";
import styles from "./ElevatedScreenDivider.module.scss";

interface ElevatedScreenDividerProps {
  left: ReactNode;
  right: ReactNode;
}

const ElevatedScreenDivider = ({ left, right }: ElevatedScreenDividerProps) => {
  return (
    <Row className={styles.container} gutter={[32, 32]}>
      <Col
        xs={24} // 100% on mobile
        sm={24} // 100% on small screens
        md={12} // 50% on medium screens and up
        lg={12}
        xl={12}
      >
        <Card className={styles.card}>{left}</Card>
      </Col>
      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
        <div className={styles.height}>{right}</div>
      </Col>
    </Row>
  );
};

export default ElevatedScreenDivider;
