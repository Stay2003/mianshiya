"use client";

import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import { useState, useEffect } from "react";
import "./index.css";

export default function QuestionPage({ params }) {
    const { questionId } = params;
    const [showAnswer, setShowAnswer] = useState(false);
    const [question, setQuestion] = useState<API.QuestionVO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchQuestion() {
            setLoading(true);
            try {
                const res = await getQuestionVoByIdUsingGet({
                    id: questionId,
                });
                setQuestion(res.data);
            } catch (e) {
                message.error("获取题目详情失败，" + e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestion();
        setShowAnswer(false);
    }, [questionId]);

    if (loading || !question) {
        return <div>加载中...</div>;
    }

    return (
        <div id="questionPage">
            <QuestionCard
                question={question}
                showAnswer={showAnswer}
                onToggleAnswer={() => setShowAnswer(!showAnswer)}
            />
        </div>
    );
}

