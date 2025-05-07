"use server";
import {searchQuestionVoByPageUsingPost} from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default async function QuestionsPage({searchParams}) {
    // 获取 url 的查询参数
    const {q: searchText} = searchParams;
    // 题目列表和总数
    let questionList = [];
    let total = 0;

    try {
        const res = await searchQuestionVoByPageUsingPost({
            searchText,
            pageSize: 12,
            sortField: "createTime",
            sortOrder: "descend",
        });
        // @ts-ignore
        questionList = res.data.records ?? [];
        // @ts-ignore
        total = res.data.total ?? 0;
    } catch (e) {
        console.error("获取题目列表失败，" + e.message);
    }

    return (
        <div className="questions-container">
            <div className="questions-header">
                <h1 className="questions-title">题目大全</h1>
                <p className="questions-subtitle">探索丰富的编程题目，提升你的编程技能</p>
            </div>

            <div className="questions-content">
                {questionList.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📝</div>
                        <p className="empty-text">暂无题目</p>
                    </div>
                ) : (
                    <QuestionTable
                        defaultQuestionList={questionList}
                        defaultTotal={total}
                        defaultSearchParams={{
                            title: searchText,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
