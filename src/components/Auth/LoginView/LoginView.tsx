// pages/login.tsx or components/Login.tsx
import { Button, Card, Layout, Typography } from 'antd';
import Image from 'next/image';
import styles from './LoginView.module.scss';

const { Content } = Layout;
const { Title } = Typography;

export default function Login() {
  const handleGoogleLogin = () => {
    console.log('Redirecting to Google login...');
  };

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Card className={styles.card}>
          <Image
            src="/images/garagify.webp"
            alt="Garagify Logo"
            width={800}
            height={200}
            className={styles.logo}
          />
          <Title level={3}>Welcome to Garagify</Title>
          <Button
            type="default"
            icon={
              <Image
                src="/images/google.webp"
                alt="Google"
                width={20}
                height={20}
                className={styles.googleIcon}
              />
            }
            onClick={handleGoogleLogin}
            block
            className={styles.googleButton}
          >
            <div>Sign in with Google</div>
          </Button>
        </Card>
      </Content>
    </Layout>
  );
}
