import React from "react";

export default function GuidePage() {
  return (
    <div style={{maxWidth: 700, margin: '40px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(22,119,255,0.08)', padding: 36}}>
      <h1 style={{color: '#1677ff', fontWeight: 700, fontSize: 28, marginBottom: 16}}>新人指引</h1>
      <div style={{color: '#555', fontSize: 17, marginBottom: 24}}>
        欢迎来到刷题鸭！这里有丰富的题库和活跃的社区，助你高效刷题、提升技能。
      </div>
      <ol style={{color: '#333', fontSize: 16, lineHeight: 2, paddingLeft: 20}}>
        <li><b>如何开始刷题？</b><br/>点击顶部"题库中心"或"首页"选择题库，进入后选择题目即可开始刷题。</li>
        <li><b>如何收藏/管理题目？</b><br/>在题目详情页点击"收藏"按钮，收藏的题目可在"个人中心-我的收藏"查看和管理。</li>
        <li><b>如何查看刷题记录？</b><br/>进入"个人中心"，可查看刷题日历、历史记录等。</li>
        <li><b>如何参与社区互动？</b><br/>可在题目下方评论区留言，与其他用户交流。</li>
        <li><b>遇到问题如何反馈？</b><br/>可在页面右下角点击"我要反馈"按钮，或加入QQ群：123456789。</li>
      </ol>
      <div style={{marginTop: 32, color: '#888', fontSize: 15, textAlign: 'center'}}>
        如有更多疑问，欢迎加入交流群或联系管理员！
      </div>
    </div>
  );
} 