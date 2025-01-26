"use client"

import { message } from "antd"
import { getQuestionVoByIdUsingGet } from "@/api/questionController"
import { getQuestionFavourUsingGet } from "@/api/questionFavourController"
import QuestionCard from "@/components/QuestionCard"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import "./index.css"
import type React from "react"

// @ts-ignore
export default function QuestionPage({ params }) {
    const { questionId } = params
    const searchParams = useSearchParams()
    const fromFavorites = searchParams.get("fromFavorites") === "true"

    const [showAnswer, setShowAnswer] = useState(false)
    const [question, setQuestion] = useState<API.QuestionVO | null>(null)
    const [isFavour, setIsFavour] = useState<boolean>(fromFavorites)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchQuestionAndFavourStatus() {
            setLoading(true)
            try {
                const questionRes = await getQuestionVoByIdUsingGet({ id: questionId })
                // @ts-ignore
                if (questionRes.code === 0 && questionRes.data) {
                    // @ts-ignore
                    setQuestion(questionRes.data)
                } else {
                    // @ts-ignore
                    message.error(questionRes.message || "获取题目详情失败")
                }

                if (!fromFavorites) {
                    try {
                        const favourRes = await getQuestionFavourUsingGet({ questionId })
                        // @ts-ignore
                        if (favourRes.code === 0) {
                            // @ts-ignore
                            setIsFavour(favourRes.data)
                        }
                    } catch (favourError) {
                        console.error("Failed to fetch favourite status:", favourError)
                        setIsFavour(false)
                    }
                }
            } catch (e) {
                // @ts-ignore
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
        return <div>加载中...</div>
    }

    return (
        <div id="questionPage">
            <QuestionCard
                question={{ ...question, isFavour }}
                showAnswer={showAnswer}
                onToggleAnswer={() => setShowAnswer(!showAnswer)}
                onFavourChange={handleFavourChange}
            />
        </div>
    )
}

