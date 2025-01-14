import { addQuestionBankUsingPost } from '@/api/questionBankController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

interface Props {
    visible: boolean;
    columns: ProColumns<API.QuestionBank>[];
    onSubmit: (values: API.QuestionBankAddRequest) => void;
    onCancel: () => void;
}

/**
 * Convert image file to base64
 * @param file
 */
const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.QuestionBankAddRequest) => {
    const hide = message.loading('正在添加');
    try {
        await addQuestionBankUsingPost(fields);
        hide();
        message.success('创建成功');
        return true;
    } catch (error: any) {
        hide();
        console.error('创建失败，' + error.message);
        return false;
    }
};

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
    const { visible, columns, onSubmit, onCancel } = props;
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState(false);

    const handleUpload = async (file: RcFile) => {
        try {
            setLoading(true);
            const base64 = await getBase64(file);
            setImageUrl(base64);
            return false; // Prevent default upload behavior
        } catch (error) {
            message.error('图片上传失败');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    return (
        <Modal
            destroyOnClose
            title={'创建'}
            open={visible}
            footer={null}
            onCancel={() => {
                setImageUrl(undefined);
                onCancel?.();
            }}
        >
            <ProTable
                type="form"
                columns={[
                    {
                        title: "标题",
                        dataIndex: "title",
                        valueType: "text",
                    },
                    {
                        title: "描述",
                        dataIndex: "description",
                        valueType: "text",
                    },
                    {
                        title: "图片",
                        dataIndex: "picture",
                        renderFormItem: () => (
                            <Upload
                                name="picture"
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={handleUpload}
                            >
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt="avatar"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        ),
                    },
                ]}
                onSubmit={async (values: API.QuestionBankAddRequest) => {
                    if (imageUrl) {
                        values.picture = imageUrl;
                    }
                    const success = await handleAdd(values);
                    if (success) {
                        setImageUrl(undefined);
                        onSubmit?.(values);
                    }
                }}
            />
        </Modal>
    );
};

export default CreateModal;

