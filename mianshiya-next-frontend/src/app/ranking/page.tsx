"use client"

import React, { useCallback } from "react"
import { useEffect, useState } from "react"
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController"
import { useRouter } from "next/navigation"
import "./index.css"

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
            if (res?.data?.records) {
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
        router.push(`/bank/${id}`)
    }

    return (
        <div className="ranking-container">
            <div className="ranking-header">
                <h1 className="ranking-title">题库排行榜</h1>
                <p className="ranking-subtitle">最受欢迎的题库集合</p>
            </div>

            <div className="ranking-content">
                {loading ? (
                    <div className="loading-skeleton">
                        {[...Array(10)].map((_, index) => (
                            <div key={index} className="skeleton-item">
                                <div className="skeleton-rank"></div>
                                <div className="skeleton-info">
                                    <div className="skeleton-title"></div>
                                    <div className="skeleton-views"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ranking-list">
                        {rankings.map((item, index) => (
                            <div 
                                key={item.id} 
                                className={`ranking-item ${index < 3 ? 'top-rank' : ''}`}
                                onClick={() => handleBankClick(item.id)}
                            >
                                <div className={`rank-number rank-${index + 1}`}>
                                    {index + 1}
                                </div>
                                <div className="rank-info">
                                    <h3 className="rank-title">
                                        {item.title}
                                        {index < 3 && (
                                            <span className="hot-badge">
                                                <span className="fire-icon">🔥</span>
                                                热门
                                            </span>
                                        )}
                                    </h3>
                                    <div className="rank-views">
                                        <span className="eye-icon">👁️</span>
                                        {item.viewNum} 次浏览
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

