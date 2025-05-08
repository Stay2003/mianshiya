"use client";
import React from "react";

const tags = ['算法','Java','前端','数据库','面试','动态规划','二分','字符串','数据结构','SQL','LeetCode'];

export default function HotTagsBar() {
  return (
    <div style={{overflowX: 'auto', whiteSpace: 'nowrap', padding: '4px 0'}}>
      {tags.map(tag => (
        <span
          key={tag}
          style={{
            display: 'inline-block',
            background: '#f0f5ff',
            color: '#1677ff',
            borderRadius: 16,
            padding: '4px 16px',
            marginRight: 10,
            fontSize: 15,
            fontWeight: 500,
            boxShadow: '0 1px 4px rgba(22,119,255,0.06)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.background='#e6f4ff')}
          onMouseOut={e => (e.currentTarget.style.background='#f0f5ff')}
        >
          #{tag}
        </span>
      ))}
    </div>
  );
} 