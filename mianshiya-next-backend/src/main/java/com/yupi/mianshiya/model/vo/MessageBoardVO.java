package com.yupi.mianshiya.model.vo;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 留言板视图对象
 */
@Data
public class MessageBoardVO implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * id
     */
    private Long id;

    /**
     * 留言内容
     */
    private String content;

    /**
     * 留言用户信息
     */
    private UserVO user;

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
}