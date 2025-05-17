import { Button, Layout, Menu } from "antd";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import labels from "@/labels.json";
import { signOut } from "next-auth/react";
const {
  navigation: { borrowing, lending, logout },
} = labels;
const Navbar = () => {
  return (
    <Layout.Header className={styles.navbar}>
      <Menu
        mode="horizontal"
        selectable={false}
        items={[
          {
            key: borrowing,
            label: <Link href="/borrow">{borrowing}</Link>,
          },
          {
            key: lending,
            label: <Link href="/lend">{lending}</Link>,
          },
          {
            key: logout,
            onClick: () => signOut(),
            label: "logout",
          },
        ]}
      />
    </Layout.Header>
  );
};

export default Navbar;
