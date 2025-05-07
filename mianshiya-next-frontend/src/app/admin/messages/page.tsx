"use client"

import { useState, useEffect } from "react"
import { Table, Button, Input, Space, message, Popconfirm, Tag } from "antd"
import { SearchOutlined, DeleteOutlined, PushpinOutlined } from "@ant-design/icons"
import { listMessageUsingGet, deleteMessageUsingDelete, pinMessageUsingPost } from "@/api/messageBoardController"
import dayjs from "dayjs"

const AdminMessagesPage = () => {
    const [messages, setMessages] = useState<API.MessageBoardVO[]>([])
    const [loading, setLoading] = useState(false)
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [searchText, setSearchText] = useState("")

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const params: API.listMessageUsingGETParams = {
                current,
                pageSize,
            }
            if (searchText) {
                params.searchText = searchText
            }
            const res = await listMessageUsingGet(params)
            // @ts-ignore
            if (res.data) {
                setMessages(res.data.records || [])
                setTotal(res.data.total || 0)
            }
        } catch (error) {
            message.error("获取评论列表失败")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [current, pageSize, searchText])

    const columns = [
        {
            title: "用户",
            dataIndex: ["user", "userName"],
            key: "userName",
            render: (text: string, record: API.MessageBoardVO) => (
                <Space>
                    <img
                        src={record.user?.userAvatar}
                        alt={text}
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: "评论内容",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
        },
        {
            title: "发布时间",
            dataIndex: "createTime",
            key: "createTime",
            render: (text: string) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "点赞数",
            dataIndex: "likeCount",
            key: "likeCount",
            render: (count: number) => <Tag color="blue">{count}</Tag>,
        },
        {
            title: "举报数",
            dataIndex: "reportCount",
            key: "reportCount",
            render: (count: number) => (
                <Tag color={count > 0 ? "red" : "default"}>{count}</Tag>
            ),
        },
        {
            title: "操作",
            key: "action",
            render: (_: any, record: API.MessageBoardVO) => (
                <Space size="middle">
                    <Popconfirm
                        title="确定要删除这条评论吗？"
                        onConfirm={() => record.id && handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                    <Button
                        type="text"
                        icon={<PushpinOutlined />}
                        onClick={() => record.id && handlePin(record.id)}
                    >
                        置顶
                    </Button>
                </Space>
            ),
        },
    ]

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteMessageUsingDelete({ messageId: id })
            if (res.data) {
                message.success("删除成功")
                fetchMessages()
            } else {
                message.error("删除失败")
            }
        } catch (error) {
            message.error("删除失败")
        }
    }

    const handlePin = async (id: number) => {
        try {
            const res = await pinMessageUsingPost({ messageId: id })
            if (res.data) {
                message.success("置顶成功")
                fetchMessages()
            } else {
                message.error("置顶失败")
            }
        } catch (error) {
            message.error("置顶失败")
        }
    }

    return (
        <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">评论管理</h1>
                <Input
                    placeholder="搜索评论内容"
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={messages}
                rowKey="id"
                loading={loading}
                pagination={{
                    current,
                    pageSize,
                    total,
                    onChange: (page, size) => {
                        setCurrent(page)
                        setPageSize(size)
                    },
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条评论`,
                }}
            />
        </div>
    )
}

export default AdminMessagesPage 