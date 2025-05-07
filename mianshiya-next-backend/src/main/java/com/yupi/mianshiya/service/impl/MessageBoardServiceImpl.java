package com.yupi.mianshiya.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.mapper.MessageBoardMapper;
import com.yupi.mianshiya.mapper.MessageLikeMapper;
import com.yupi.mianshiya.model.entity.MessageBoard;
import com.yupi.mianshiya.model.entity.MessageLike;
import com.yupi.mianshiya.model.entity.Question;
import com.yupi.mianshiya.model.entity.User;
import com.yupi.mianshiya.model.vo.MessageBoardVO;
import com.yupi.mianshiya.model.vo.MessageBoardManageVO;
import com.yupi.mianshiya.service.MessageBoardService;
import com.yupi.mianshiya.service.QuestionService;
import com.yupi.mianshiya.service.SensitiveWordService;
import com.yupi.mianshiya.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageBoardServiceImpl extends ServiceImpl<MessageBoardMapper, MessageBoard>
        implements MessageBoardService {

    @Resource
    private UserService userService;

    @Resource
    private SensitiveWordService sensitiveWordService;

    @Resource
    private QuestionService questionService;

    @Resource
    private MessageLikeMapper messageLikeMapper;

    @Override
    @CacheEvict(value = "messageList", allEntries = true)
    public long createMessage(MessageBoard messageBoard, HttpServletRequest request) {
        if (messageBoard == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (StringUtils.isBlank(messageBoard.getContent())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "留言内容不能为空");
        }
        if (messageBoard.getQuestionId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "题目不存在");
        }
        User loginUser = userService.getLoginUser(request);
        messageBoard.setUserId(loginUser.getId());
        messageBoard.setLikeCount(0);
        messageBoard.setReportCount(0);

        // 敏感词过滤
        String filteredContent = sensitiveWordService.filter(messageBoard.getContent());
        messageBoard.setContent(filteredContent);

        boolean result = this.save(messageBoard);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "创建失败");
        }
        return messageBoard.getId();
    }

    @Override
    @Cacheable(value = "messageList", key = "#questionId + '-' + #current + '-' + #pageSize")
    public Page<MessageBoardVO> listMessageByQuestionId(long questionId, long current, long pageSize) {
        QueryWrapper<MessageBoard> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("questionId", questionId);
        queryWrapper.orderByDesc("createTime");
        Page<MessageBoard> messagePage = this.page(new Page<>(current, pageSize), queryWrapper);

        List<MessageBoardVO> messageVOList = messagePage.getRecords().stream().map(message -> {
            MessageBoardVO messageVO = new MessageBoardVO();
            BeanUtils.copyProperties(message, messageVO);
            User user = userService.getById(message.getUserId());
            if (user != null) {
                messageVO.setUser(userService.getUserVO(user));
            }
            return messageVO;
        }).collect(Collectors.toList());

        Page<MessageBoardVO> messageBoardVOPage = new Page<>(messagePage.getCurrent(), messagePage.getSize(), messagePage.getTotal());
        messageBoardVOPage.setRecords(messageVOList);
        return messageBoardVOPage;
    }

    @Override
    @CacheEvict(value = "messageList", key = "#messageId")
    public boolean likeMessage(long messageId, HttpServletRequest request) {
        // 获取当前登录用户
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }
        long userId = loginUser.getId();

        // 检查留言是否存在
        MessageBoard messageBoard = this.getById(messageId);
        if (messageBoard == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "留言不存在");
        }

        // 检查是否已经点赞
        LambdaQueryWrapper<MessageLike> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(MessageLike::getMessageId, messageId)
                .eq(MessageLike::getUserId, userId);
        MessageLike messageLike = messageLikeMapper.selectOne(queryWrapper);
        
        if (messageLike != null) {
            // 如果已经点赞，则取消点赞
            messageLikeMapper.deleteById(messageLike.getId());
            messageBoard.setLikeCount(messageBoard.getLikeCount() - 1);
        } else {
            // 如果未点赞，则添加点赞
            MessageLike newMessageLike = new MessageLike();
            newMessageLike.setMessageId(messageId);
            newMessageLike.setUserId(userId);
            messageLikeMapper.insert(newMessageLike);
            messageBoard.setLikeCount(messageBoard.getLikeCount() + 1);
        }
        
        return this.updateById(messageBoard);
    }

    @Override
    @CacheEvict(value = "messageList", key = "#messageId")
    public boolean reportMessage(long messageId, HttpServletRequest request) {
        MessageBoard message = this.getById(messageId);
        if (message == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        // TODO: 可以添加逻辑防止重复举报
        message.setReportCount(message.getReportCount() + 1);
        return this.updateById(message);
    }

    @Override
    public Page<MessageBoardManageVO> listMessageManageByPage(long current, long pageSize) {
        // 分页查询留言
        Page<MessageBoard> messagePage = this.page(new Page<>(current, pageSize), new QueryWrapper<MessageBoard>().orderByDesc("createTime"));
        
        // 转换为管理视图
        List<MessageBoardManageVO> messageManageVOList = messagePage.getRecords().stream().map(message -> {
            MessageBoardManageVO messageManageVO = new MessageBoardManageVO();
            BeanUtils.copyProperties(message, messageManageVO);
            
            // 获取用户信息
            User user = userService.getById(message.getUserId());
            if (user != null) {
                messageManageVO.setUserName(user.getUserName());
            }
            
            // 获取题目信息
            Question question = questionService.getById(message.getQuestionId());
            if (question != null) {
                messageManageVO.setQuestionTitle(question.getTitle());
            }
            
            return messageManageVO;
        }).collect(Collectors.toList());
        
        // 封装分页结果
        Page<MessageBoardManageVO> messageManageVOPage = new Page<>(messagePage.getCurrent(), messagePage.getSize(), messagePage.getTotal());
        messageManageVOPage.setRecords(messageManageVOList);
        return messageManageVOPage;
    }

    @Override
    public boolean deleteMessage(long messageId) {
        if (messageId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        return this.removeById(messageId);
    }

    @Override
    public boolean pinMessage(long messageId) {
        if (messageId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        MessageBoard message = this.getById(messageId);
        if (message == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        // 切换置顶状态
        message.setIsPinned(message.getIsPinned() == 1 ? 0 : 1);
        return this.updateById(message);
    }

    @Override
    public Page<MessageBoardManageVO> searchMessage(String searchText, long current, long pageSize) {
        QueryWrapper<MessageBoard> queryWrapper = new QueryWrapper<>();
        if (StringUtils.isNotBlank(searchText)) {
            queryWrapper.like("content", searchText);
        }
        queryWrapper.orderByDesc("isPinned", "createTime");
        
        Page<MessageBoard> messagePage = this.page(new Page<>(current, pageSize), queryWrapper);
        
        List<MessageBoardManageVO> messageManageVOList = messagePage.getRecords().stream().map(message -> {
            MessageBoardManageVO messageManageVO = new MessageBoardManageVO();
            BeanUtils.copyProperties(message, messageManageVO);
            
            // 获取用户信息
            User user = userService.getById(message.getUserId());
            if (user != null) {
                messageManageVO.setUserName(user.getUserName());
            }
            
            // 获取题目信息
            Question question = questionService.getById(message.getQuestionId());
            if (question != null) {
                messageManageVO.setQuestionTitle(question.getTitle());
            }
            
            return messageManageVO;
        }).collect(Collectors.toList());
        
        Page<MessageBoardManageVO> messageManageVOPage = new Page<>(messagePage.getCurrent(), messagePage.getSize(), messagePage.getTotal());
        messageManageVOPage.setRecords(messageManageVOList);
        return messageManageVOPage;
    }
}