package com.yupi.mianshiya.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.mianshiya.model.entity.MessageBoard;
import com.yupi.mianshiya.model.vo.MessageBoardVO;
import com.yupi.mianshiya.model.vo.MessageBoardManageVO;

import javax.servlet.http.HttpServletRequest;

public interface MessageBoardService extends IService<MessageBoard> {

    /**
     * 创建留言
     *
     * @param messageBoard 留言信息
     * @param request HTTP请求
     * @return 新留言 id
     */
    long createMessage(MessageBoard messageBoard, HttpServletRequest request);

    /**
     * 分页获取题目的留言列表
     *
     * @param questionId 题目 id
     * @param current 当前页码
     * @param pageSize 页面大小
     * @return 留言列表
     */
    Page<MessageBoardVO> listMessageByQuestionId(long questionId, long current, long pageSize);

    /**
     * 点赞/取消点赞留言
     *
     * @param messageId 留言 id
     * @param request HTTP请求
     * @return 是否成功
     */
    boolean likeMessage(long messageId, HttpServletRequest request);

    /**
     * 举报留言
     *
     * @param messageId 留言 id
     * @param request HTTP请求
     * @return 是否成功
     */
    boolean reportMessage(long messageId, HttpServletRequest request);

    /**
     * 分页获取留言管理列表
     *
     * @param current 当前页码
     * @param pageSize 页面大小
     * @return 留言管理列表
     */
    Page<MessageBoardManageVO> listMessageManageByPage(long current, long pageSize);

    /**
     * 删除留言
     *
     * @param messageId 留言id
     * @return 是否成功
     */
    boolean deleteMessage(long messageId);

    /**
     * 置顶/取消置顶留言
     *
     * @param messageId 留言id
     * @return 是否成功
     */
    boolean pinMessage(long messageId);

    /**
     * 分页搜索留言
     *
     * @param searchText 搜索文本
     * @param current 当前页码
     * @param pageSize 页面大小
     * @return 留言列表
     */
    Page<MessageBoardManageVO> searchMessage(String searchText, long current, long pageSize);
}