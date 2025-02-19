// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

export async function getQuestionFavourUsingGet(params: {
  questionId: number | string
}) {
  return request<API.BaseResponseBoolean_>("/api/question_favour/get", {
    method: "GET",
    params: { ...params },
  })
}


/** doQuestionFavour POST /api/question_favour/ */
export async function doQuestionFavourUsingPost(
  body: API.QuestionFavourAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseInt_>('/api/question_favour/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listMyFavourQuestionByPage POST /api/question_favour/my/list/page */
export async function listMyFavourQuestionByPageUsingPost(
  body: API.QuestionFavourQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageQuestionVO_>('/api/question_favour/my/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
