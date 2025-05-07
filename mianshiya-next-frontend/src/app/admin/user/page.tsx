"use client"
import CreateModal from "./components/CreateModal"
import UpdateModal from "./components/UpdateModal"
import { deleteUserUsingPost, listUserByPageUsingPost } from "@/api/userController"
import { PlusOutlined } from "@ant-design/icons"
import type { ActionType, ProColumns } from "@ant-design/pro-components"
import { PageContainer, ProTable } from "@ant-design/pro-components"
import { Button, message, Space, Typography, Modal } from "antd"
import type React from "react"
import { useRef, useState } from "react"
import type { User as APIUser } from "@/types/yanmo"

/**
 * 用户管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
    // 是否显示新建窗口
    const [createModalVisible, setCreateModalVisible] = useState<boolean>(false)
    // 是否显示更新窗口
    const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false)
    const actionRef = useRef<ActionType>()
    // 当前用户点击的数据
    const [currentRow, setCurrentRow] = useState<APIUser>()

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: APIUser) => {
        Modal.confirm({
            title: "确认删除",
            content: `确定要删除用户 "${row.userName}" 吗？`,
            okText: "确认",
            cancelText: "取消",
            onOk: async () => {
                const hide = message.loading("正在删除")
                try {
                    await deleteUserUsingPost({
                        id: row.id as any,
                    })
                    hide()
                    message.success("删除成功")
                    actionRef?.current?.reload()
                } catch (error: any) {
                    hide()
                    message.error("删除失败，" + error.message)
                }
            },
        })
    }

    /**
     * 表格列配置
     */
    const columns: ProColumns<APIUser>[] = [
        {
            title: "id",
            dataIndex: "id",
            valueType: "text",
            hideInForm: true,
        },
        {
            title: "账号",
            dataIndex: "userAccount",
            valueType: "text",
        },
        {
            title: "用户名",
            dataIndex: "userName",
            valueType: "text",
        },
        {
            title: "头像",
            dataIndex: "userAvatar",
            valueType: "image",
            fieldProps: {
                width: 64,
            },
            hideInSearch: true,
        },
        {
            title: "简介",
            dataIndex: "userProfile",
            valueType: "textarea",
        },
        {
            title: "权限",
            dataIndex: "userRole",
            valueEnum: {
                user: {
                    text: "用户",
                },
                admin: {
                    text: "管理员",
                },
            },
        },
        {
            title: "创建时间",
            sorter: true,
            dataIndex: "createTime",
            valueType: "dateTime",
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: "更新时间",
            sorter: true,
            dataIndex: "updateTime",
            valueType: "dateTime",
            hideInSearch: true,
            hideInForm: true,
        },
        {
            title: "操作",
            dataIndex: "option",
            valueType: "option",
            render: (_, record) => (
                <Space size="middle">
                    <Typography.Link
                        onClick={() => {
                            setCurrentRow(record)
                            setUpdateModalVisible(true)
                        }}
                    >
                        修改
                    </Typography.Link>
                    <Typography.Link type="danger" onClick={() => handleDelete(record)}>
                        删除
                    </Typography.Link>
                </Space>
            ),
        },
    ]

    return (
        <PageContainer>
            <ProTable<APIUser>
                headerTitle={"查询表格"}
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setCreateModalVisible(true)
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0]
                    const sortOrder = sort?.[sortField] ?? undefined

                    const { data, code } = await listUserByPageUsingPost({
                        ...params,
                        sortField,
                        sortOrder,
                        ...filter,
                    } as API.UserQueryRequest)

                    return {
                        success: code === 0,
                        data: data?.records || [],
                        total: Number(data?.total) || 0,
                    }
                }}
                columns={columns}
            />
            <CreateModal
                visible={createModalVisible}
                columns={columns}
                onSubmit={() => {
                    setCreateModalVisible(false)
                    actionRef.current?.reload()
                }}
                onCancel={() => {
                    setCreateModalVisible(false)
                }}
            />
            <UpdateModal
                visible={updateModalVisible}
                columns={columns}
                oldData={currentRow}
                onSubmit={() => {
                    setUpdateModalVisible(false)
                    setCurrentRow(undefined)
                    actionRef.current?.reload()
                }}
                onCancel={() => {
                    setUpdateModalVisible(false)
                }}
            />
        </PageContainer>
    )
}

export default UserAdminPage

