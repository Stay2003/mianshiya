"use client"

import { message } from "antd"
import { getQuestionVoByIdUsingGet } from "@/api/questionController"
import { getQuestionFavourUsingGet } from "@/api/questionFavourController"
import QuestionCard from "@/components/QuestionCard"
import MessageBoard from "@/components/MessageBoard"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import "./index.css"

export default function QuestionPage({ params }: { params: { questionId: string } }) {
    const { questionId } = params
    const searchParams = useSearchParams()
    const fromFavorites = searchParams.get("fromFavorites") === "true"

    const [showAnswer, setShowAnswer] = useState(false)
    const [question, setQuestion] = useState<API.QuestionVO | null>(null)
    const [isFavour, setIsFavour] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchQuestionAndFavourStatus() {
            setLoading(true)
            try {
                const questionRes = await getQuestionVoByIdUsingGet({ id: questionId })
                if (questionRes.code === 0 && questionRes.data) {
                    setQuestion(questionRes.data)

                    try {
                        const favourRes = await getQuestionFavourUsingGet({ questionId })
                        if (favourRes.code === 0) {
                            setIsFavour(favourRes.data)
                        }
                    } catch (favourError) {
                        console.error("Failed to fetch favourite status:", favourError)
                        setIsFavour(fromFavorites)
                    }
                } else {
                    message.error(questionRes.message || "获取题目详情失败")
                }
            } catch (e: any) {
                message.error("获取题目信息失败，" + e.message)
            } finally {
                setLoading(false)
            }
        }

        fetchQuestionAndFavourStatus()
        setShowAnswer(false)
    }, [questionId, fromFavorites])

    const handleFavourChange = (newFavourStatus: boolean) => {
        setIsFavour(newFavourStatus)
    }

    if (loading || !question) {
        return (
            <div className="question-loading">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
            </div>
        )
    }

    return (
        <div className="question-container">
            <div className="question-content">
                <QuestionCard
                    question={{ ...question, isFavour }}
                    showAnswer={showAnswer}
                    onToggleAnswer={() => setShowAnswer(!showAnswer)}
                    onFavourChange={handleFavourChange}
                />

                <div className="message-section">
                    <h2 className="message-title">留言讨论</h2>
                    <MessageBoard questionId={Number(questionId)} />
                </div>
            </div>
        </div>
    )
}

