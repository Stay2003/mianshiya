"use client";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import BasicLayout from "@/layouts/BasicLayout";
import React, { useCallback, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store, { AppDispatch } from "@/stores";
import { getLoginUserUsingGet } from "@/api/userController";
import AccessLayout from "@/access/AccessLayout";
import { setLoginUser } from "@/stores/loginUser";
import "./globals.css";

/**
 * 全局初始化逻辑
 * @param children
 * @constructor
 */
const InitLayout: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  // 初始化全局用户状态
  const doInitLoginUser = useCallback(async () => {
    try {
      const res = await getLoginUserUsingGet();
      if (res.data) {
        // 更新全局用户状态
        // @ts-ignore
        dispatch(setLoginUser(res.data));
      }
    } catch (error: any) {
      console.error('获取用户信息失败:', error);
      // 如果是网络错误，可能是后端服务未启动
      if (error.message === 'Network Error') {
        console.error('请确保后端服务已启动，并且端口为8101');
      }
    }
  }, []);

  // 只执行一次
  useEffect(() => {
    doInitLoginUser();
  }, []);
  return children;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body>
        <AntdRegistry>
          <Provider store={store}>
            <InitLayout>
              <BasicLayout>
                <AccessLayout>{children}</AccessLayout>
              </BasicLayout>
            </InitLayout>
          </Provider>
        </AntdRegistry>
      </body>
    </html>
  );
}
