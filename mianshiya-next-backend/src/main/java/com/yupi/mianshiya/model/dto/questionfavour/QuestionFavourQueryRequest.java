package com.yupi.mianshiya.model.dto.questionfavour;

import com.yupi.mianshiya.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 题目收藏查询请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class QuestionFavourQueryRequest extends PageRequest implements Serializable {
    /**
     * 题目ID
     */
    private Long questionId;

    /**
     * 用户ID
     */
    private Long userId;

    private static final long serialVersionUID = 1L;
}

