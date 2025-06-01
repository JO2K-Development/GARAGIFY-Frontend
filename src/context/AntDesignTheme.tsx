import { ConfigProvider } from "antd";
import { PropsWithChildren } from "react";

const GarazeTheme = ({ children }: PropsWithChildren) => {
  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default GarazeTheme;
