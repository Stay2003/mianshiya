package com.yupi.mianshiya.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.mapper.QuestionFavourMapper;
import com.yupi.mianshiya.model.dto.questionfavour.QuestionFavourQueryRequest;
import com.yupi.mianshiya.model.entity.Question;
import com.yupi.mianshiya.model.entity.QuestionFavour;
import com.yupi.mianshiya.model.entity.User;
import com.yupi.mianshiya.model.vo.QuestionVO;
import com.yupi.mianshiya.service.QuestionFavourService;
import com.yupi.mianshiya.service.QuestionService;
import com.yupi.mianshiya.service.UserService;
import org.springframework.aop.framework.AopContext;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 题目收藏服务实现
 */
@Service
public class QuestionFavourServiceImpl extends ServiceImpl<QuestionFavourMapper, QuestionFavour>
        implements QuestionFavourService {

    @Resource
    private QuestionService questionService;

    @Resource
    private UserService userService;

    /**
     * 题目收藏
     *
     * @param userId     用户id
     * @param questionId 题目id
     * @return 收藏结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int doQuestionFavour(Long userId, Long questionId) {
        // 判断参数是否合法
        if (userId == null || questionId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        // 判断题目是否存在
        Question question = questionService.getById(questionId);
        if (question == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "题目不存在");
        }
        // 判断是否已收藏
        QuestionFavour questionFavour = new QuestionFavour();
        questionFavour.setUserId(userId);
        questionFavour.setQuestionId(questionId);
        QueryWrapper<QuestionFavour> questionFavourQueryWrapper = new QueryWrapper<>(questionFavour);
        QuestionFavour oldQuestionFavour = this.getOne(questionFavourQueryWrapper);
        boolean result;
        // 已收藏
        if (oldQuestionFavour != null) {
            // 取消收藏
            result = this.remove(questionFavourQueryWrapper);
            if (result) {
                // 题目收藏数 - 1
                result = questionService.update()
                        .eq("id", questionId)
                        .setSql("favourNum = favourNum - 1")
                        .update();
                if (!result) {
                    throw new BusinessException(ErrorCode.SYSTEM_ERROR, "更新题目收藏数失败");
                }
                return -1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "取消收藏失败");
            }
        } else {
            // 未收藏
            result = this.save(questionFavour);
            if (result) {
                // 题目收藏数 + 1
                result = questionService.update()
                        .eq("id", questionId)
                        .setSql("favourNum = favourNum + 1")
                        .update();
                if (!result) {
                    throw new BusinessException(ErrorCode.SYSTEM_ERROR, "更新题目收藏数失败");
                }
                return 1;
            } else {
                throw new BusinessException(ErrorCode.SYSTEM_ERROR, "收藏失败");
            }
        }
    }

    @Override
    public Page<QuestionVO> listFavourQuestionByPage(QuestionFavourQueryRequest questionFavourQueryRequest) {
        if (questionFavourQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long userId = questionFavourQueryRequest.getUserId();
        long current = questionFavourQueryRequest.getCurrent();
        long size = questionFavourQueryRequest.getPageSize();

        // 限制爬虫
        if (size > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 查询收藏的题目信息
        Page<Question> questionPage = questionService.page(new Page<>(current, size),
                new QueryWrapper<Question>()
                        .inSql("id", "select questionId from question_favour where userId = " + userId + " and isDelete = 0")
                        .orderByDesc("createTime"));
        List<Question> questionList = questionPage.getRecords();

        // 获取题目对应的用户信息
        Set<Long> userIds = questionList.stream()
                .map(Question::getUserId)
                .collect(Collectors.toSet());
        Map<Long, User> userMap = userService.listByIds(userIds).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        // 填充信息
        List<QuestionVO> questionVOList = questionList.stream().map(question -> {
            QuestionVO questionVO = getQuestionVO(question);
            User user = userMap.get(question.getUserId());
            if (user != null) {
                questionVO.setUserName(user.getUserName());
                questionVO.setUserAvatar(user.getUserAvatar());
            }
            return questionVO;
        }).collect(Collectors.toList());

        // 创建新的 Page<QuestionVO> 对象
        Page<QuestionVO> questionVOPage = new Page<>(questionPage.getCurrent(), questionPage.getSize(), questionPage.getTotal());
        questionVOPage.setRecords(questionVOList);

        return questionVOPage;
    }

    /**
     * 获取题目封装
     *
     * @param question 题目信息
     * @return 题目封装
     */
    private QuestionVO getQuestionVO(Question question) {
        if (question == null) {
            return null;
        }
        QuestionVO questionVO = new QuestionVO();
        BeanUtils.copyProperties(question, questionVO);
        return questionVO;
    }

    /**
     * 题目收藏（内部服务）
     *
     * @param userId     用户id
     * @param questionId 题目id
     * @return 收藏结果
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public int doQuestionFavourInner(Long userId, Long questionId) {
        if (userId == null || questionId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QuestionFavourService questionFavourService = (QuestionFavourService) AopContext.currentProxy();
        return questionFavourService.doQuestionFavour(userId, questionId);
    }

    /**
     * 获取用户收藏的题目数量
     *
     * @param userId 用户id
     * @return 收藏数量
     */
    @Override
    public long getUserFavourQuestionCount(Long userId) {
        if (userId == null || userId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        return this.count(new QueryWrapper<QuestionFavour>()
                .eq("userId", userId)
                .eq("isDelete", 0));
    }

    @Override
    public boolean isQuestionFavoured(Long userId, Long questionId) {
        if (userId == null || questionId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        QueryWrapper<QuestionFavour> questionFavourQueryWrapper = new QueryWrapper<>();
        questionFavourQueryWrapper.eq("userId", userId);
        questionFavourQueryWrapper.eq("questionId", questionId);
        questionFavourQueryWrapper.eq("isDelete", 0);
        long count = this.count(questionFavourQueryWrapper);
        return count > 0;
    }
}