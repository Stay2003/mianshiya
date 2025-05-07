"use client";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { userRegisterUsingPost } from "@/api/userController";
import { message } from "antd";
import { ProForm } from "@ant-design/pro-form/lib";
import { useRouter } from "next/navigation";
import './index.css';

/**
 * 用户注册页面
 * @constructor
 */
const UserRegisterPage: React.FC = () => {
  const [form] = ProForm.useForm();
  const router = useRouter();

  /**
   * 提交
   */
  const doSubmit = async (values: API.UserRegisterRequest) => {
    try {
      const res = await userRegisterUsingPost(values);
      if (res.data?.data) {
        message.success("注册成功，请登录");
        // 前往登录页
        router.replace("/user/login");
        form.resetFields();
      } else {
        message.error(res.data?.message || "注册失败");
      }
    } catch (e: any) {
      message.error("注册失败，" + e.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-header">
          <Image 
            src="/assets/logo.png" 
            alt="面试鸭" 
            height={64} 
            width={64}
            className="register-logo"
          />
          <h1 className="register-title">刷题鸭</h1>
          <p className="register-subtitle">程序员面试刷题网站</p>
        </div>

        <LoginForm
          form={form}
          onFinish={doSubmit}
          className="register-form"
          submitter={{
            searchConfig: {
              submitText: "注册",
            },
          }}
        >
          <ProFormText
            name="userAccount"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className="form-icon" />,
            }}
            placeholder="请输入用户账号"
            rules={[
              {
                required: true,
                message: "请输入用户账号!",
              },
            ]}
          />
          <ProFormText.Password
            name="userPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className="form-icon" />,
            }}
            placeholder="请输入密码"
            rules={[
              {
                required: true,
                message: "请输入密码！",
              },
            ]}
          />
          <ProFormText.Password
            name="checkPassword"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className="form-icon" />,
            }}
            placeholder="请输入确认密码"
            rules={[
              {
                required: true,
                message: "请输入确认密码！",
              },
            ]}
          />
          <div className="register-actions">
            <Link href="/user/login" className="login-link">
              已有账号？去登录
            </Link>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default UserRegisterPage;
