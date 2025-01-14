import { updateQuestionBankUsingPost } from '@/api/questionBankController';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { message, Modal, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';

interface Props {
  oldData?: API.QuestionBank;
  visible: boolean;
  columns: ProColumns<API.QuestionBank>[];
  onSubmit: (values: API.QuestionBankAddRequest) => void;
  onCancel: () => void;
}

/**
 * 将图片文件转换为base64
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
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.QuestionBankUpdateRequest) => {
  const hide = message.loading('正在更新');
  try {
    await updateQuestionBankUsingPost(fields);
    hide();
    message.success('更新成功');
    return true;
  } catch (error: any) {
    hide();
    console.error('更新失败，' + error.message);
    return false;
  }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const { oldData, visible, columns, onSubmit, onCancel } = props;
  const [imageUrl, setImageUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (oldData && oldData.picture) {
      setImageUrl(oldData.picture);
    }
  }, [oldData]);

  const handleUpload = async (file: RcFile) => {
    try {
      setLoading(true);
      const base64 = await getBase64(file);
      setImageUrl(base64);
      return false; // 阻止默认上传行为
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

  if (!oldData) {
    return <></>;
  }

  return (
      <Modal
          destroyOnClose
          title={'更新'}
          open={visible}
          footer={null}
          onCancel={() => {
            setImageUrl(oldData.picture);
            onCancel?.();
          }}
      >
        <ProTable
            type="form"
            columns={[
              ...columns,
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
            form={{
              initialValues: oldData,
            }}
            onSubmit={async (values: API.QuestionBankAddRequest) => {
              if (imageUrl) {
                values.picture = imageUrl;
              }
              const success = await handleUpdate({
                ...values,
                id: oldData.id as any,
              });
              if (success) {
                onSubmit?.(values);
              }
            }}
        />
      </Modal>
  );
};

export default UpdateModal;