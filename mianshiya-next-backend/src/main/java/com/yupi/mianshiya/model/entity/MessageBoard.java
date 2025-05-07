package com.yupi.mianshiya.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

/**
 * 留言板实体
 */
@Data
@TableName("message_board")
public class MessageBoard {

    /**
     * id
     */
    @TableId(type = IdType.AUTO)
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
     * 关联的题目id
     */
    private Long questionId;

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
     * 更新时间
     */
    private Date updateTime;

    /**
     * 是否置顶
     */
    @TableField("is_pinned")
    private Integer isPinned;

    /**
     * 是否删除
     */
    @TableLogic
    private Integer isDelete;
}