"use server";
import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import QuestionBankList from "@/components/QuestionBankList";
import "./index.css";

/**
 * 题库列表页面
 * @constructor
 */
export default async function BanksPage() {
  let questionBankList = [];
  const pageSize = 200;
  
  try {
    const res = await listQuestionBankVoByPageUsingPost({
      pageSize,
      sortField: "createTime",
      sortOrder: "descend",
    });
    questionBankList = res.data.records ?? [];
  } catch (error: any) {
    console.error("获取题库列表失败，" + error.message);
  }

  return (
    <div className="banks-container">
      <div className="banks-header">
        <h1 className="banks-title">题库大全</h1>
        <p className="banks-subtitle">探索丰富的编程题库，提升你的编程技能</p>
      </div>

      <div className="banks-content">
        {questionBankList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <p className="empty-text">暂无题库</p>
          </div>
        ) : (
          <QuestionBankList 
            questionBankList={questionBankList} 
            className="banks-grid"
          />
        )}
      </div>
    </div>
  );
}

