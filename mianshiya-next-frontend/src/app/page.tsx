import Title from "antd/es/typography/Title";
import { Divider, Flex } from "antd";
import Link from "next/link";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionBankList from "@/components/QuestionBankList";
import QuestionList from "@/components/QuestionList";
import "./index.css";
import HotTagsBar from '@/components/HotTagsBar';
import NewbieGuideButton from '@/components/NewbieGuideButton';

// 本页面使用服务端渲染，禁用静态生成
export const dynamic = 'force-dynamic';

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
  let questionBankList = [];
  let questionList = [];
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    // @ts-ignore
    questionBankList = res.data.records ?? [];
  } catch (e) {
    // @ts-ignore
    console.error("获取题库列表失败，" + e.message);
  }

  try {
    const res = await listQuestionVoByPageUsingPost({
      pageSize: 12,
      sortField: "createTime",
      sortOrder: "descend",
    });
    // @ts-ignore
    questionList = res.data.records ?? [];
  } catch (e) {
    // @ts-ignore
    console.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="homePage" className="max-width-content modern-home" style={{position: 'relative'}}>
      <NewbieGuideButton />
      <div style={{textAlign: 'center', fontSize: 22, fontWeight: 600, margin: '32px 0 16px 0', color: '#1677ff', letterSpacing: 1}}>
        欢迎来到刷题鸭，和小伙伴一起进步！
      </div>
      <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16}}>
        <HotTagsBar />
      </div>
      <div className="section-header">
        <Title level={3} className="section-title">最新题库</Title>
        <Link href={"/banks"} className="view-more-link">查看更多</Link>
      </div>
      <div className="content-wrapper">
        <QuestionBankList questionBankList={questionBankList} />
      </div>
      <Divider className="custom-divider" />
      <div className="section-header">
        <Title level={3} className="section-title">最新题目</Title>
        <Link href={"/questions"} className="view-more-link">查看更多</Link>
      </div>
      <div className="content-wrapper">
        <QuestionList questionList={questionList} />
      </div>
    </div>
  );
}

