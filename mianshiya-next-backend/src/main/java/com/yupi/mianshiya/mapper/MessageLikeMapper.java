package com.yupi.mianshiya.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.yupi.mianshiya.model.entity.MessageLike;
import org.apache.ibatis.annotations.Mapper;

/**
 * 留言点赞记录 Mapper
 */
@Mapper
public interface MessageLikeMapper extends BaseMapper<MessageLike> {
} 