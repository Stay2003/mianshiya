package com.yupi.mianshiya.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.mianshiya.common.BaseResponse;
import com.yupi.mianshiya.common.ErrorCode;
import com.yupi.mianshiya.common.ResultUtils;
import com.yupi.mianshiya.exception.BusinessException;
import com.yupi.mianshiya.model.entity.MessageBoard;
import com.yupi.mianshiya.model.vo.MessageBoardVO;
import com.yupi.mianshiya.model.vo.MessageBoardManageVO;
import com.yupi.mianshiya.service.MessageBoardService;
import com.yupi.mianshiya.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/message")
public class MessageBoardController {

    @Resource
    private MessageBoardService messageBoardService;

    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addMessage(@RequestBody MessageBoard messageBoard, HttpServletRequest request) {
        if (messageBoard == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        long result = messageBoardService.createMessage(messageBoard, request);
        return ResultUtils.success(result);
    }

    @GetMapping("/list")
    public BaseResponse<Page<?>> listMessage(
            @RequestParam(value = "questionId", required = false) Long questionId,
            @RequestParam(value = "current", defaultValue = "1") long current,
            @RequestParam(value = "pageSize", defaultValue = "10") long pageSize) {
        if (current <= 0 || pageSize <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (questionId != null && questionId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Page<?> messagePage;
        if (questionId != null) {
            messagePage = messageBoardService.listMessageByQuestionId(questionId, current, pageSize);
        } else {
            messagePage = messageBoardService.listMessageManageByPage(current, pageSize);
        }
        return ResultUtils.success(messagePage);
    }

    @PostMapping("/like/{messageId}")
    public BaseResponse<Boolean> likeMessage(@PathVariable("messageId") long messageId, HttpServletRequest request) {
        if (messageId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = messageBoardService.likeMessage(messageId, request);
        return ResultUtils.success(result);
    }

    @PostMapping("/report/{messageId}")
    public BaseResponse<Boolean> reportMessage(@PathVariable("messageId") long messageId, HttpServletRequest request) {
        if (messageId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        boolean result = messageBoardService.reportMessage(messageId, request);
        return ResultUtils.success(result);
    }

    @GetMapping("/manage/list")
    public BaseResponse<Page<MessageBoardManageVO>> listMessageManage(
            @RequestParam(value = "current", defaultValue = "1") long current,
            @RequestParam(value = "pageSize", defaultValue = "10") long pageSize,
            HttpServletRequest request) {
        // 校验是否为管理员
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        Page<MessageBoardManageVO> messageManagePage = messageBoardService.listMessageManageByPage(current, pageSize);
        return ResultUtils.success(messageManagePage);
    }

    @DeleteMapping("/manage/delete/{messageId}")
    public BaseResponse<Boolean> deleteMessage(@PathVariable long messageId, HttpServletRequest request) {
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = messageBoardService.deleteMessage(messageId);
        return ResultUtils.success(result);
    }

    @PostMapping("/manage/pin/{messageId}")
    public BaseResponse<Boolean> pinMessage(@PathVariable long messageId, HttpServletRequest request) {
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean result = messageBoardService.pinMessage(messageId);
        return ResultUtils.success(result);
    }

    @GetMapping("/manage/search")
    public BaseResponse<Page<MessageBoardManageVO>> searchMessage(
            @RequestParam(required = false) String searchText,
            @RequestParam(value = "current", defaultValue = "1") long current,
            @RequestParam(value = "pageSize", defaultValue = "10") long pageSize,
            HttpServletRequest request) {
        if (!userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        Page<MessageBoardManageVO> messageManagePage = messageBoardService.searchMessage(searchText, current, pageSize);
        return ResultUtils.success(messageManagePage);
    }
}