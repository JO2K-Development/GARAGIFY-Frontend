// components/LoginView.tsx
"use client";

import { Button, Typography } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import styles from "./LoginView.module.scss";
import labels from "@/labels.json";
const { Text } = Typography;
const {
  login: { loginButton },
} = labels;
const LoginView = () => {
  return (
    <div className={styles.container}>
      <Button
        className={styles.googleButton}
        onClick={() => signIn("google")}
        icon={
          <Image
            src="/images/google.webp"
            alt="Google logo"
            width={18}
            height={18}
          />
        }
      >
        <Text className={styles.buttonText}>{loginButton}</Text>
      </Button>
    </div>
  );
};

export default LoginView;
