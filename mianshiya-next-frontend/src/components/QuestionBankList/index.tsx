"use client";
import { Avatar, Card, List, Typography } from "antd";
import Link from "next/link";
import { EyeOutlined } from "@ant-design/icons";
import "./index.css";

interface Props {
    questionBankList: API.QuestionBankVO[];
}

/**
 * 题库列表组件
 * @param props
 * @constructor
 */
const QuestionBankList = (props: Props) => {
    const { questionBankList = [] } = props;
    const questionBankView = (questionBank: API.QuestionBankVO) => {
        return (
            <Card>
                <Link href={`/bank/${questionBank.id}`}>
                    <Card.Meta
                        avatar={<Avatar src={questionBank.picture} />}
                        title={questionBank.title}
                        description={
                            <div>
                                <Typography.Paragraph
                                    type="secondary"
                                    ellipsis={{ rows: 1 }}
                                    style={{ marginBottom: 4 }}
                                >
                                    {questionBank.description}
                                </Typography.Paragraph>
                                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                    <EyeOutlined style={{ marginRight: 4 }} />
                                    {questionBank.viewNum || 0} 次浏览
                                </Typography.Text>
                            </div>
                        }
                    />
                </Link>
            </Card>
        );
    };

    return (
        <div className="question-bank-list">
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                }}
                dataSource={questionBankList}
                renderItem={(item) => <List.Item>{questionBankView(item)}</List.Item>}
            />
        </div>
    );
};

export default QuestionBankList;

