"use client"

import React, { useCallback } from "react"
import { Card, List, Space, Tooltip } from "antd"
import { FireOutlined, EyeOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController"
import { useRouter } from "next/navigation"

interface QuestionBankVO {
    id: number
    title: string
    viewNum: number
}

export default function RankingPage() {
    const router = useRouter()
    const [rankings, setRankings] = useState<QuestionBankVO[]>([])
    const [loading, setLoading] = useState(false)

    const fetchRankings = useCallback(async () => {
        setLoading(true)
        try {
            const res = await listQuestionBankVoByPageUsingPost({
                pageSize: 100,
                current: 1,
                sortField: "viewNum",
                sortOrder: "desc",
            })
            // @ts-ignore
            if (res?.data?.records) {
                // @ts-ignore
                setRankings(res.data.records)
            }
        } catch (error) {
            console.error("获取排行榜失败:", error)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchRankings()
    }, [fetchRankings])

    const handleBankClick = (id: number) => {
        // 使用 router.push 进行导航，确保路径与你的实际路由结构匹配
        router.push(`/bank/${id}`)
    }

    const getRankingColor = (index: number) => {
        switch (index) {
            case 0:
                return "#f5222d"
            case 1:
                return "#fa8c16"
            case 2:
                return "#faad14"
            default:
                return "#8c8c8c"
        }
    }

    return (
        <div className="p-4">
            <Card title="题库排行榜">
                <List<QuestionBankVO>
                    loading={loading}
                    dataSource={rankings}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <div
                                        style={{
                                            width: 24,
                                            height: 24,
                                            borderRadius: "50%",
                                            background: getRankingColor(index),
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                }
                                title={
                                    <Space>
                                        <a
                                            onClick={() => handleBankClick(item.id)}
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                        >
                                            {item.title}
                                        </a>
                                        {index < 3 && (
                                            <Tooltip title="热门题库">
                                                <FireOutlined style={{ color: getRankingColor(index) }} />
                                            </Tooltip>
                                        )}
                                    </Space>
                                }
                            />
                            <Space>
                                <EyeOutlined />
                                {item.viewNum}
                            </Space>
                        </List.Item>
                    )}
                />
            </Card>
        </div>
    )
}

