"use client"

import { StarOutlined, StarFilled } from "@ant-design/icons"
import { Button, message } from "antd"
import { useState } from "react"
import { doQuestionFavourUsingPost } from "@/api/questionFavourController"

interface FavoriteButtonProps {
    questionId: number
    initialIsFavour: boolean
    onFavourChange?: (isFavour: boolean) => void
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ questionId, initialIsFavour, onFavourChange }) => {
    const [isFavour, setIsFavour] = useState<boolean>(initialIsFavour)
    const [loading, setLoading] = useState(false)

    const handleFavorite = async () => {
        setLoading(true)
        try {
            const res = await doQuestionFavourUsingPost({ questionId })
            // @ts-ignore
            if (res?.code === 0) {
                const newFavourStatus = !isFavour
                setIsFavour(newFavourStatus)
                onFavourChange?.(newFavourStatus)
                // @ts-ignore
                message.success(newFavourStatus ? "收藏成功" : "已取消收藏")
            } else {
                // @ts-ignore
                message.error(res?.message || "操作失败")
            }
        } catch (error) {
            message.error("操作失败，请重试")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            type="text"
            icon={isFavour ? <StarFilled style={{ color: "#faad14" }} /> : <StarOutlined />}
            onClick={handleFavorite}
            loading={loading}
        >
            {isFavour ? "已收藏" : "收藏"}
        </Button>
    )
}

export default FavoriteButton

