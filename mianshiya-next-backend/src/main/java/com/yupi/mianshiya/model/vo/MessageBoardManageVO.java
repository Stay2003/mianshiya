package com.yupi.mianshiya.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 留言管理视图
 */
@Data
public class MessageBoardManageVO implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 留言内容
     */
    private String content;

    /**
     * 留言用户id
     */
    private Long userId;

    /**
     * 留言用户昵称
     */
    private String userName;

    /**
     * 关联的题目id
     */
    private Long questionId;

    /**
     * 题目标题
     */
    private String questionTitle;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 举报数
     */
    private Integer reportCount;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 是否置顶
     */
    private Integer isPinned;
} 