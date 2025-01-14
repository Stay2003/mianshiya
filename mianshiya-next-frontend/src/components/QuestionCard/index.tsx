"use client";
import { Button, Card } from "antd";
import Title from "antd/es/typography/Title";
import TagList from "@/components/TagList";
import MdViewer from "@/components/MdViewer";
import useAddUserSignInRecord from "@/hooks/useAddUserSignInRecord";
import { EyeOutlined, EyeInvisibleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import "./index.css";

interface Props {
    question: API.QuestionVO;
    showAnswer?: boolean;
    onToggleAnswer?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
    hasPrevious?: boolean;
    hasNext?: boolean;
}

const QuestionCard = (props: Props) => {
    const {
        question,
        showAnswer = false,
        onToggleAnswer,
        onPrevious,
        onNext,
        hasPrevious,
        hasNext
    } = props;

    useAddUserSignInRecord();

    return (
        <div className="question-card">
            <Card>
                <Title level={1} style={{ fontSize: 24 }}>
                    {question.title}
                </Title>
                <TagList tagList={question.tagList} />
                <div style={{ marginBottom: 16 }} />
                <MdViewer value={question.content} />
            </Card>
            <div style={{ marginBottom: 16 }} />
            <div className="answer-section">
                <Button
                    className="nav-button nav-button-left"
                    icon={<LeftOutlined />}
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                />
                <Card
                    title="推荐答案"
                    extra={
                        <Button
                            type="link"
                            icon={showAnswer ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            onClick={onToggleAnswer}
                        >
                            {showAnswer ? '隐藏答案' : '查看答案'}
                        </Button>
                    }
                >
                    {showAnswer && <MdViewer value={question.answer} />}
                </Card>
                <Button
                    className="nav-button nav-button-right"
                    icon={<RightOutlined />}
                    onClick={onNext}
                    disabled={!hasNext}
                />
            </div>
        </div>
    );
};

export default QuestionCard;
