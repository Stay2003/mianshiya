"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Avatar, Button, Input, message } from "antd"
import { HeartFilled, HeartOutlined, WarningOutlined } from "@ant-design/icons"
import {
    listMessageUsingGet,
    likeMessageUsingPost,
    reportMessageUsingPost,
    addMessageUsingPost,
} from "@/api/messageBoardController"
import dayjs from "dayjs"

interface MessageBoardProps {
    questionId: number
}

const MessageBoard: React.FC<MessageBoardProps> = ({ questionId }) => {
    const [messages, setMessages] = useState<API.MessageBoard[]>([])
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(0)
    const pageSize = 10

    const fetchMessages = async () => {
        try {
            const res = await listMessageUsingGet({
                questionId,
                current,
                pageSize,
            })
            // @ts-ignore
            if (res.code === 0 && res.data) {
                setMessages(res.data.records || [])
                setTotal(res.data.total || 0)
            }
        } catch (error) {
            message.error("获取留言失败")
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [questionId, current])

    const handleSubmit = async () => {
        if (!content.trim()) {
            message.warning("请输入留言内容")
            return
        }
        setLoading(true)
        try {
            const res = await addMessageUsingPost({
                content: content.trim(),
                questionId,
            })
            // @ts-ignore
            if (res.code === 0) {
                message.success("留言成功")
                setContent("")
                setCurrent(1)
                fetchMessages()
            }
        } catch (error) {
            message.error("留言失败")
        } finally {
            setLoading(false)
        }
    }

    const handleLike = async (messageId: number) => {
        const originalMessages = [...messages]
        try {
            // 乐观更新本地状态
            const updatedMessages = messages.map(msg => {
                if (msg.id === messageId) {
                    const newHasLiked = !msg.hasLiked
                    const newLikeCount = newHasLiked ?
                        (msg.likeCount || 0) + 1 :
                        Math.max(0, (msg.likeCount || 0) - 1)

                    return {
                        ...msg,
                        hasLiked: newHasLiked,
                        likeCount: newLikeCount
                    }
                }
                return msg
            })
            setMessages(updatedMessages)

            // 发送API请求
            const res = await likeMessageUsingPost({ messageId })
            // @ts-ignore
            if (res.code !== 0) {
                throw new Error('点赞操作失败')
            }
        } catch (error) {
            // 回滚状态
            setMessages(originalMessages)
            message.error("操作失败，请重试")
        }
    }

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-8">
                <div className="mb-4">
                    <Input.TextArea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="写下你的想法..."
                        maxLength={500}
                        rows={4}
                        className="w-full rounded-lg border-gray-200 hover:border-blue-400 focus:border-blue-400 transition-colors"
                        style={{ resize: 'none' }}
                    />
                    <div className="text-right text-gray-400 text-sm mt-1">
                        {content.length}/500
                    </div>
                </div>
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    className="bg-blue-500 hover:bg-blue-600"
                    size="large"
                >
                    发布留言
                </Button>
            </div>

            <div className="space-y-8">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <div className="text-4xl mb-2">💭</div>
                        <div>暂无留言，快来发表你的想法吧~</div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex justify-between items-start">
                                {/* 左侧：用户信息 + 内容 */}
                                <div className="flex flex-col w-full">
                                    <div className="flex items-center mb-1">
                                        <Avatar
                                            src={msg.user?.userAvatar}
                                            size={36}
                                            className="border border-gray-100"
                                        />
                                        <span className="font-semibold text-gray-800 ml-2">
                                            {msg.user?.userName || '匿名用户'}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 break-words leading-relaxed">
                                        {msg.content}
                                    </p>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {dayjs(msg.createTime).format("YYYY-MM-DD HH:mm")}
                                    </div>
                                </div>

                                {/* 右侧：点赞按钮 */}
                                <div className="flex items-start justify-end">
                                    <button
                                        onClick={() => msg.id && handleLike(msg.id)}
                                        className={`flex items-center gap-1.5 transition-colors select-none ${
                                            msg.hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-blue-500'
                                        }`}
                                    >
                                        {msg.hasLiked ? <HeartFilled /> : <HeartOutlined />}
                                        <span className="text-sm min-w-[20px] text-center">
                                            {msg.likeCount || 0}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {total > pageSize && (
                <div className="mt-8 flex justify-center items-center gap-4">
                    <Button.Group>
                        <Button
                            onClick={() => setCurrent((prev) => Math.max(1, prev - 1))}
                            disabled={current === 1}
                            className="hover:border-blue-400"
                        >
                            上一页
                        </Button>
                        <Button
                            onClick={() => setCurrent((prev) => prev + 1)}
                            disabled={current * pageSize >= total}
                            className="hover:border-blue-400"
                        >
                            下一页
                        </Button>
                    </Button.Group>
                    <span className="text-gray-500">
                        第 {current} 页 / 共 {Math.ceil(total / pageSize)} 页
                    </span>
                </div>
            )}
        </div>
    )
}

export default MessageBoard
