import { Layout, Typography, Space } from "antd";

const { Text, Link } = Typography;
const Footer = () => {
  return (
    <Layout.Footer
      style={{
        textAlign: "center",
        padding: "2rem",
        backgroundColor: "#f0f2f5",
        borderTop: "1px solid #d9d9d9",
      }}
    >
      <Space direction="vertical" size="small">
        <Text type="secondary">© {new Date().getFullYear()} Garaze Inc.</Text>
        <Space>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/contact">Contact</Link>
        </Space>
      </Space>
    </Layout.Footer>
  );
};

export default Footer;
