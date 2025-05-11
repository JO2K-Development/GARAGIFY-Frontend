import { Layout, Menu } from "antd";
import Link from "next/link";
import styles from "./Navbar.module.scss";
import labels from "@/labels.json";
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
            label: <Link href="/login">{logout}</Link>,
          },
        ]}
      />
    </Layout.Header>
  );
};

export default Navbar;
