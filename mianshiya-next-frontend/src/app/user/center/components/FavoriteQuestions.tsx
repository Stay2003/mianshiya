"use client"

import { useEffect, useState, useCallback } from "react"
import { List, message, Pagination, Empty } from "antd"
import { listMyFavourQuestionByPageUsingPost } from "@/api/questionFavourController"
import QuestionCard from "@/components/QuestionCard"

const FavoriteQuestions = () => {
    const [loading, setLoading] = useState(false)
    const [questions, setQuestions] = useState<API.QuestionVO[]>([])
    const [total, setTotal] = useState(0)
    const [current, setCurrent] = useState(1)
    const pageSize = 10

    const fetchFavorites = useCallback(async (page: number) => {
        setLoading(true)
        try {
            const res = await listMyFavourQuestionByPageUsingPost({
                current: page,
                pageSize,
            })
            // @ts-ignore
            if (res?.code === 0) {
                // @ts-ignore
                setQuestions(res.data.records)
                // @ts-ignore
                setTotal(res.data.total)
            }
        } catch (error) {
            message.error("获取收藏列表失败")
        } finally {
            setLoading(false)
        }
    }, []) // Empty dependency array since pageSize is constant

    useEffect(() => {
        fetchFavorites(current)
    }, [current, fetchFavorites]) // fetchFavorites is now memoized and won't cause infinite loops

    if (!loading && questions.length === 0) {
        return <Empty description="暂无收藏的题目" />
    }

    return (
        <div>
            <List
                loading={loading}
                dataSource={questions}
                renderItem={(question) => (
                    <List.Item>
                        <QuestionCard
                            question={{
                                ...question,
                                tagList: question.tagList || [],
                            }}
                        />
                    </List.Item>
                )}
            />
            {total > pageSize && (
                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Pagination current={current} total={total} pageSize={pageSize} onChange={(page) => setCurrent(page)} />
                </div>
            )}
        </div>
    )
}

export default FavoriteQuestions

