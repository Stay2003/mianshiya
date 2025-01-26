import request from "@/libs/request"

/** 收藏/取消收藏题目 POST /api/question_favour/ */
export async function doQuestionFavourUsingPost(
    body: {
        questionId: number
    },
    options?: { [key: string]: any },
) {
    return request<API.BaseResponseInt_>("/api/question_favour/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    })
}

/** 获取我收藏的题目列表 POST /api/question_favour/my/list/page */
export async function listMyFavourQuestionByPageUsingPost(
    body: {
        current?: number
        pageSize?: number
        sortField?: string
        sortOrder?: string
    },
    options?: { [key: string]: any },
) {
    return request<API.BaseResponsePageQuestionVO_>("/api/question_favour/my/list/page", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        data: body,
        ...(options || {}),
    })
}

/** 获取题目收藏状态 GET /api/question_favour/get/my/favour */
export async function getQuestionFavourUsingGet(
    params: {
        questionId: number
    },
    options?: { [key: string]: any },
) {
    return request<API.BaseResponseBoolean_>("/api/question_favour/get/my/favour", {
        method: "GET",
        params: params,
        ...(options || {}),
    })
}

