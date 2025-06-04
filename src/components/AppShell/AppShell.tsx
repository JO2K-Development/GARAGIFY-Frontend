"use client";
import React, { PropsWithChildren } from "react";
import { Layout } from "antd";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import styles from "./AppShell.module.scss";

const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />
      <Layout.Content className={styles.content}>{children}</Layout.Content>
      <Footer />
    </Layout>
  );
};

export default AppShell;
