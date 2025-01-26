"use client"

import {useEffect, useState, useCallback} from "react"
import {List, message, Pagination, Empty} from "antd"
import {listMyFavourQuestionByPageUsingPost} from "@/api/questionFavourController"
import {StarFilled} from "@ant-design/icons"
import Link from "next/link"

const FavoriteQuestionList = () => {
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
            if (res?.code === 0 && res?.data) {
                // @ts-ignore
                setQuestions(res.data.records)
                // @ts-ignore
                setTotal(res.data.total)
            } else {
                // @ts-ignore
                message.error(res?.message || "获取收藏列表失败")
            }
        } catch (error) {
            message.error("获取收藏列表失败")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFavorites(current)
    }, [current, fetchFavorites])

    if (!loading && questions.length === 0) {
        return <Empty description="暂无收藏的题目"/>
    }

    return (
        <div>
            <List
                loading={loading}
                dataSource={questions}
                renderItem={(question) => (
                    <List.Item>
                        <Link
                            href={{
                                pathname: `/question/${question.id}`,
                                query: {fromFavorites: "true"},
                            }}
                            className="flex items-center w-full py-4 px-2 hover:bg-gray-50 transition-colors rounded cursor-pointer"
                        >
                            <StarFilled className="text-yellow-500 mr-3"/>
                            <div className="flex-1">
                                <div className="text-blue-600 hover:text-blue-800 font-medium">{question.title}</div>
                                <div className="mt-1 text-sm text-gray-500">
                                    {question.tagList?.map((tag) => (
                                        <span key={tag} className="mr-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                            <span className="text-gray-400 text-sm ml-4">
                                {question.createTime ? new Date(question.createTime).toLocaleDateString() : "未知时间"}
                            </span>
                        </Link>
                    </List.Item>
                )}
            />
            {total > pageSize && (
                <div style={{textAlign: "center", marginTop: 16}}>
                    <Pagination current={current} total={total} pageSize={pageSize}
                                onChange={(page) => setCurrent(page)}/>
                </div>
            )}
        </div>
    )
}

export default FavoriteQuestionList

