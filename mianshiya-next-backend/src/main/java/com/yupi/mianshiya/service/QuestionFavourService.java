package com.yupi.mianshiya.service;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.mianshiya.model.dto.questionfavour.QuestionFavourQueryRequest;
import com.yupi.mianshiya.model.entity.Question;
import com.yupi.mianshiya.model.entity.QuestionFavour;
import com.yupi.mianshiya.model.entity.User;
import com.yupi.mianshiya.model.vo.QuestionVO;


/**
 * 题目收藏服务
 */
public interface QuestionFavourService extends IService<QuestionFavour> {

    /**
     * 题目收藏
     *
     * @param userId
     * @param questionId
     * @return
     */
    int doQuestionFavour(Long userId, Long questionId);

    /**
     * 分页获取用户收藏的题目列表
     *
     * @param questionFavourQueryRequest
     * @param favourUserId
     * @return
     */
    Page<QuestionVO> listFavourQuestionByPage(QuestionFavourQueryRequest questionFavourQueryRequest);

    /**
     * 题目收藏（内部服务）
     *
     * @param userId
     * @param questionId
     * @return
     */
    int doQuestionFavourInner(Long userId, Long questionId);

    long getUserFavourQuestionCount(Long userId);

    boolean isQuestionFavoured(Long userId, Long questionId);

//    /**
//     * 获取题目封装（包含收藏状态）
//     * @param question
//     * @param loginUser
//     * @return
//     */
//    QuestionVO getQuestionVO(Question question, User loginUser);
}

