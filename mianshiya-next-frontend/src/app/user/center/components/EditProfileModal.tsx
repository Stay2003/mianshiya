"use client";
import { Modal, Form, Input, Upload, message } from "antd";
import { UserOutlined, MailOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { RcFile } from "antd/es/upload/interface";

interface EditProfileModalProps {
    open: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues: {
        userName: string;
        userProfile: string;
        userEmail?: string;
        userAvatar: string;
    };
}

const EditProfileModal = ({ open, onCancel, onSubmit, initialValues }: EditProfileModalProps) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(initialValues.userAvatar);

    const getBase64 = (file: RcFile): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("只能上传 JPG/PNG 格式的图片！");
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error("图片大小不能超过 2MB！");
            return false;
        }
        return true;
    };

    const handleChange = async (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }

        try {
            const base64Url = await getBase64(info.file.originFileObj);
            setImageUrl(base64Url);
            form.setFieldValue('userAvatar', base64Url);
        } catch (error) {
            message.error('图片处理失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传头像</div>
        </div>
    );

    return (
        <Modal
            open={open}
            title="编辑个人资料"
            onCancel={onCancel}
            onOk={() => form.submit()}
            okText="保存"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={onSubmit}
            >
                <Form.Item name="userAvatar" label="头像">
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                        customRequest={({ onSuccess }) => onSuccess?.("ok")}
                    >
                        {imageUrl ? (
                            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>
                <Form.Item
                    name="userName"
                    label="用户名"
                    rules={[{ required: true, message: "请输入用户名" }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
                </Form.Item>
                <Form.Item
                    name="userEmail"
                    label="邮箱"
                    rules={[
                        { type: "email", message: "请输入有效的邮箱地址" },
                        { required: true, message: "请输入邮箱" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="请输入邮箱" />
                </Form.Item>
                <Form.Item name="userProfile" label="个人简介">
                    <Input.TextArea
                        placeholder="请输入个人简介"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditProfileModal;

