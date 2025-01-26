"use client"

import {useEffect, useState} from "react"
import {Card, List, message, Pagination} from "antd"
// @ts-ignore
import type {QuestionVO} from "@/types/question"
import QuestionCard from "@/components/QuestionCard"

const FavoritesPage = () => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<QuestionVO[]>([])
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const pageSize = 10

    const fetchFavorites = async (page: number) => {
        setLoading(true)
        try {
            const response = await fetch("/api/question_favour/my/list/page", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    current: page,
                    pageSize,
                }),
            })

            const data = await response.json()
            if (data.code === 0) {
                setQuestions(data.data.records)
                setTotal(data.data.total)
            } else {
                message.error(data.message || "获取收藏列表失败")
            }
        } catch (error) {
            message.error("获取收藏列表失败")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFavorites(current)
    }, [current, fetchFavorites]) // Added fetchFavorites to dependencies

    const handleFavoriteChange = async (questionId: number, isFavorite: boolean) => {
        if (!isFavorite) {
            // 当取消收藏时，重新加载列表
            await fetchFavorites(current)
        }
    }

    return (
        <div className="max-width-content">
            <Card title="我的收藏">
                <List
                    loading={loading}
                    dataSource={questions}
                    renderItem={(question) => (
                        <List.Item>
                            <QuestionCard
                                question={question}
                                onFavoriteChange={(isFavorite) => handleFavoriteChange(question.id, isFavorite)}
                            />
                        </List.Item>
                    )}
                />
                <div style={{textAlign: "center", marginTop: 16}}>
                    <Pagination current={current} total={total} pageSize={pageSize}
                                onChange={(page) => setCurrent(page)}/>
                </div>
            </Card>
        </div>
    )
}

export default FavoritesPage

