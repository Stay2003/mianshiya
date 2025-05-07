"use client";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {LoginForm, ProFormText} from "@ant-design/pro-components";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {userLoginUsingPost} from "@/api/userController";
import {message} from "antd";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/stores";
import {setLoginUser} from "@/stores/loginUser";
import {ProForm} from "@ant-design/pro-form/lib";
import {useRouter} from "next/navigation";
import './index.css';

/**
 * 用户登录页面
 * @constructor
 */
const UserLoginPage: React.FC = () => {
    const [form] = ProForm.useForm();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const doSubmit = async (values: API.UserLoginRequest) => {
        try {
            const res = await userLoginUsingPost(values);
            if (res.data) {
                message.success("登录成功");
                dispatch(setLoginUser(res.data));
                router.replace("/");
                form.resetFields();
            }
        } catch (e) {
            console.error("登录失败，" + e.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <Image 
                        src="/assets/logo.png" 
                        alt="面试鸭" 
                        height={64} 
                        width={64}
                        className="login-logo"
                    />
                    <h1 className="login-title">刷题鸭</h1>
                    <p className="login-subtitle">程序员面试刷题网站</p>
                </div>

                <LoginForm
                    form={form}
                    onFinish={doSubmit}
                    className="login-form"
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
                    <div className="login-actions">
                        <Link href="/user/register" className="register-link">
                            还没有账号？去注册
                        </Link>
                    </div>
                </LoginForm>
            </div>
        </div>
    );
};

export default UserLoginPage;
