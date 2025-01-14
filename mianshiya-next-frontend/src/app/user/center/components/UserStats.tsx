"use client";
import { Card, Row, Col, Statistic } from "antd";
import { QuestionCircleOutlined, TrophyOutlined, FireOutlined } from "@ant-design/icons";

interface UserStatsProps {
    totalQuestions: number;
    streak: number;
    achievements: number;
}

const UserStats = ({ totalQuestions, streak, achievements }: UserStatsProps) => {
    return (
        <Card style={{ marginBottom: 16 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic
                        title="已刷题目"
                        value={totalQuestions}
                        prefix={<QuestionCircleOutlined />}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="连续刷题"
                        value={streak}
                        suffix="天"
                        prefix={<FireOutlined />}
                    />
                </Col>
                <Col span={8}>
                    <Statistic
                        title="获得成就"
                        value={achievements}
                        prefix={<TrophyOutlined />}
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default UserStats;

