"use client";
import { Flex, Menu } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./index.css";

export default function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = params;
  const router = useRouter();
  const [bank, setBank] = useState<API.QuestionBankVO | null>(null);
  const [question, setQuestion] = useState<API.QuestionVO | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const bankRes = await getQuestionBankVoByIdUsingGet({
          id: questionBankId,
          needQueryQuestionList: true,
          pageSize: 200,
        });
        setBank(bankRes.data);

        const questionRes = await getQuestionVoByIdUsingGet({
          id: questionId,
        });
        setQuestion(questionRes.data);
      } catch (e) {
        console.error("获取数据失败，" + e.message);
      }
    }
    fetchData();
    setShowAnswer(false);
  }, [questionBankId, questionId]);

  if (!bank || !question) {
    return <div>加载中...</div>;
  }

  const questionMenuItemList = (bank.questionPage?.records || []).map((q) => ({
    label: (
        <Link href={`/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>
    ),
    key: q.id,
  }));

  const currentIndex = questionMenuItemList.findIndex(
      (item) => item.key === question.id
  );

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevQuestion = bank.questionPage.records[currentIndex - 1];
      router.push(`/bank/${questionBankId}/question/${prevQuestion.id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < questionMenuItemList.length - 1) {
      const nextQuestion = bank.questionPage.records[currentIndex + 1];
      router.push(`/bank/${questionBankId}/question/${nextQuestion.id}`);
    }
  };

  return (
      <div id="bankQuestionPage">
        <Flex gap={24}>
          <Sider width={240} theme="light" style={{ padding: "24px 0" }}>
            <Title level={4} style={{ padding: "0 20px" }}>
              {bank.title}
            </Title>
            <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
          </Sider>
          <Content>
            <QuestionCard
                question={question}
                showAnswer={showAnswer}
                onToggleAnswer={() => setShowAnswer(!showAnswer)}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasPrevious={currentIndex > 0}
                hasNext={currentIndex < questionMenuItemList.length - 1}
            />
          </Content>
        </Flex>
      </div>
  );
}

