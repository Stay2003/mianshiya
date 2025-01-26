package com.yupi.mianshiya.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.mianshiya.common.BaseResponse;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.common.ResultUtils;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.model.dto.questionfavour.QuestionFavourAddRequest;
import com.yupi.mianshiya.model.dto.questionfavour.QuestionFavourQueryRequest;
import com.yupi.mianshiya.model.vo.QuestionVO;
import com.yupi.mianshiya.service.QuestionFavourService;
import com.yupi.mianshiya.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * 题目收藏接口
 */
@RestController
@RequestMapping("/question_favour")
@Slf4j
public class QuestionFavourController {

    @Resource
    private QuestionFavourService questionFavourService;

    @Resource
    private UserService userService;

    /**
     * 收藏 / 取消收藏
     *
     * @param questionFavourAddRequest
     * @param request
     * @return resultNum 收藏变化数
     */
    @PostMapping("/")
    public BaseResponse<Integer> doQuestionFavour(@RequestBody QuestionFavourAddRequest questionFavourAddRequest,
                                                  HttpServletRequest request) {
        if (questionFavourAddRequest == null || questionFavourAddRequest.getQuestionId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 登录才能操作
        final Long userId = userService.getLoginUser(request).getId();
        int result = questionFavourService.doQuestionFavour(userId, questionFavourAddRequest.getQuestionId());
        return ResultUtils.success(result);
    }

    /**
     * 获取我收藏的题目列表
     *
     * @param questionFavourQueryRequest
     * @param request
     * @return
     */
    @PostMapping("/my/list/page")
    public BaseResponse<Page<QuestionVO>> listMyFavourQuestionByPage(@RequestBody QuestionFavourQueryRequest questionFavourQueryRequest,
                                                                     HttpServletRequest request) {
        if (questionFavourQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long userId = userService.getLoginUser(request).getId();
        questionFavourQueryRequest.setUserId(userId);
        long current = questionFavourQueryRequest.getCurrent();
        long size = questionFavourQueryRequest.getPageSize();
        // 限制爬虫
        if (size > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Page<QuestionVO> questionPage = questionFavourService.listFavourQuestionByPage(questionFavourQueryRequest);
        return ResultUtils.success(questionPage);
    }
}

