// @ts-ignore
/* eslint-disable */
import request from '@/libs/request';

/** addMessage POST /api/api/message/add */
export async function addMessageUsingPost(
  body: API.MessageBoard,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/api/message/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** likeMessage POST /api/api/message/like/${param0} */
export async function likeMessageUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.likeMessageUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/api/message/like/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** listMessage GET /api/api/message/list */
export async function listMessageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMessageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageObject_>('/api/api/message/list', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  });
}

/** deleteMessage DELETE /api/api/message/manage/delete/${param0} */
export async function deleteMessageUsingDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMessageUsingDELETEParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/api/message/manage/delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** listMessageManage GET /api/api/message/manage/list */
export async function listMessageManageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.listMessageManageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMessageBoardManageVO_>('/api/api/message/manage/list', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  });
}

/** pinMessage POST /api/api/message/manage/pin/${param0} */
export async function pinMessageUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.pinMessageUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/api/message/manage/pin/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** searchMessage GET /api/api/message/manage/search */
export async function searchMessageUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.searchMessageUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageMessageBoardManageVO_>('/api/api/message/manage/search', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      ...params,
    },
    ...(options || {}),
  });
}

/** reportMessage POST /api/api/message/report/${param0} */
export async function reportMessageUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.reportMessageUsingPOSTParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<API.BaseResponseBoolean_>(`/api/api/message/report/${param0}`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}
