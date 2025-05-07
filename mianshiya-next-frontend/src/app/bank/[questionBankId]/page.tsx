"use server";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import QuestionList from "@/components/QuestionList";
import "./index.css";

/**
 * 题库详情页
 * @constructor
 */
export default async function BankPage({params}: {params: {questionBankId: string}}) {
    const {questionBankId} = params;
    let bank = undefined;

    try {
        const res = await getQuestionBankVoByIdUsingGet({
            id: questionBankId,
            needQueryQuestionList: true,
            pageSize: 200,
        });
        bank = res.data;
    } catch (error: any) {
        console.error("获取题库详情失败，" + error.message);
    }

    if (!bank) {
        return <div className="error-message">获取题库详情失败，请刷新重试</div>;
    }

    let firstQuestionId;
    if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
        firstQuestionId = bank.questionPage.records[0].id;
    }

    return (
        <div id="bankPage" className="bank-page-container">
            <div className="bank-header">
                <div className="bank-info-card">
                    <div className="bank-info-content">
                        <div className="bank-avatar">
                            <img 
                                src={bank.picture} 
                                alt={bank.title}
                                className="bank-avatar-img"
                            />
                        </div>
                        <div className="bank-details">
                            <h2 className="bank-title">
                                {bank.title}
                            </h2>
                            <p className="bank-description">
                                {bank.description}
                            </p>
                            <div className="bank-meta">
                                <span className="meta-tag">
                                    <i className="meta-icon clock-icon"></i>
                                    题目数量：{bank.questionPage?.total || 0}
                                </span>
                                <span className="meta-tag">
                                    <i className="meta-icon user-icon"></i>
                                    创建者：{bank.userName || '未知'}
                                </span>
                            </div>
                            <a
                                href={`/bank/${questionBankId}/question/${firstQuestionId}`}
                                target="_blank"
                                className={`start-button ${!firstQuestionId ? 'disabled' : ''}`}
                            >
                                <i className="play-icon"></i>
                                开始刷题
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bank-content">
                <QuestionList
                    questionBankId={questionBankId}
                    questionList={bank.questionPage?.records ?? []}
                    cardTitle={`题目列表（${bank.questionPage?.total || 0}）`}
                />
            </div>
        </div>
    );
}
