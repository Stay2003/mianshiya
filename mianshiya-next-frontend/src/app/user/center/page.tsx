"use client"
import { Avatar, Button, Card, Col, Row, Tag, Tooltip, Descriptions, message } from "antd"
import { useSelector } from "react-redux"
import type { RootState } from "@/stores"
import Title from "antd/es/typography/Title"
import { useState } from "react"
import { EditOutlined, IdcardOutlined, MailOutlined, UserOutlined, AppstoreOutlined, BookOutlined, TrophyOutlined } from "@ant-design/icons"
import { updateMyUserUsingPost } from "@/api/userController"
import "./index.css"
import UserStats from "@/app/user/center/components/UserStats"
import CalendarChart from "@/app/user/center/components/CalendarChart"
import EditProfileModal from "@/app/user/center/components/EditProfileModal"
import FavoriteQuestions from "@/app/user/center/components/FavoriteQuestions"
import FavoriteQuestionList from "./components/FavoriteQuestionList"

export default function UserCenterPage() {
    const loginUser = useSelector((state: RootState) => state.loginUser)
    const user = loginUser
    const [activeTabKey, setActiveTabKey] = useState<string>("record")
    const [isEditModalVisible, setIsEditModalVisible] = useState(false)

    // 模拟用户统计数据
    const userStats = {
        totalQuestions: 156,
        streak: 1,
        achievements: 1,
    }

    const handleEditProfile = async (values: API.UserUpdateMyRequest) => {
        try {
            const res = await updateMyUserUsingPost(values)
            // @ts-ignore
            if (res.code === 0) {
                message.success("更新成功")
                setIsEditModalVisible(false)
                // TODO: 更新 Redux 中的用户信息
            } else {
                // @ts-ignore
                message.error(res.message || "更新失败")
            }
        } catch (error) {
            message.error("操作失败，请重试")
        }
    }

    return (
        <div id="userCenterPage" className="max-width-content user-center-container">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={6}>
                    <Card className="user-profile-card" bordered={false}>
                        <div className="user-avatar-container">
                            <Avatar src={user.userAvatar} size={96} className="user-avatar" />
                        </div>
                        <div className="user-info-container">
                            <Card.Meta
                                title={
                                    <div className="user-name-container">
                                        <Title level={4} className="user-name">
                                            {user.userName}
                                        </Title>
                                        <Tooltip title="用户ID">
                                            <Tag icon={<IdcardOutlined />} color="blue" className="user-id-tag">
                                                {user.id}
                                            </Tag>
                                        </Tooltip>
                                    </div>
                                }
                                description={
                                    <div className="user-details">
                                        <Descriptions column={1} className="user-info-descriptions" size="small">
                                            <Descriptions.Item label={<UserOutlined />} className="user-info-item">
                                                {user.userName}
                                            </Descriptions.Item>
                                            <Descriptions.Item label={<MailOutlined />} className="user-info-item">
                                                {user.userEmail || "未设置邮箱"}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="简介" className="user-info-item">
                                                {user.userProfile || "这个人很懒，什么都没写~"}
                                            </Descriptions.Item>
                                        </Descriptions>
                                        <div className="edit-profile-button-container">
                                            <Button 
                                                type="primary"
                                                icon={<EditOutlined />} 
                                                onClick={() => setIsEditModalVisible(true)}
                                                className="edit-profile-button"
                                            >
                                                编辑资料
                                            </Button>
                                        </div>
                                    </div>
                                }
                            />
                        </div>
                    </Card>
                    <div style={{marginTop: 16}}>
                        <Card bordered={false} style={{padding: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', borderRadius: 12}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
                                <div><b>本月已刷题：</b>12道</div>
                                <div><b>连续签到：</b>5天</div>
                                <div><b>累计收藏：</b>8题</div>
                            </div>
                            <div style={{marginTop: 10, color: '#888', fontStyle: 'italic', textAlign: 'center'}}>
                                "每天进步一点点！"
                            </div>
                        </Card>
                    </div>
                </Col>
                <Col xs={24} md={18}>
                    <UserStats {...userStats} />
                    <Card bordered={false} style={{marginBottom: 24, borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', textAlign: 'center'}}>
                        <Button
                            type="primary"
                            icon={<AppstoreOutlined />}
                            size="large"
                            style={{borderRadius: 24, margin: '0 12px', minWidth: 120, fontWeight: 500}}
                            onClick={() => window.location.href = '/questions'}
                        >
                            去刷题
                        </Button>
                        <Button
                            icon={<BookOutlined />}
                            size="large"
                            style={{borderRadius: 24, margin: '0 12px', minWidth: 120, fontWeight: 500, background: '#f5f5f5'}}
                            onClick={() => window.location.href = '/banks'}
                        >
                            去题库
                        </Button>
                        <Button
                            icon={<TrophyOutlined />}
                            size="large"
                            style={{borderRadius: 24, margin: '0 12px', minWidth: 120, fontWeight: 500, background: '#fffbe6', color: '#faad14', border: '1px solid #ffe58f'}}
                            onClick={() => window.location.href = '/ranking'}
                        >
                            去排行榜
                        </Button>
                    </Card>
                    <Card
                        className="user-content-card"
                        bordered={false}
                        tabList={[
                            {
                                key: "record",
                                label: "刷题记录",
                            },
                            {
                                key: "favorites",
                                label: "我的收藏",
                            },
                            {
                                key: "achievements",
                                label: "成就",
                            },
                            {
                                key: "settings",
                                label: "设置",
                            },
                        ]}
                        activeTabKey={activeTabKey}
                        onTabChange={(key: string) => {
                            setActiveTabKey(key)
                        }}
                    >
                        {activeTabKey === "record" && (
                            <div className="tab-content">
                                <CalendarChart />
                            </div>
                        )}
                        {activeTabKey === "favorites" && (
                            <div className="tab-content">
                                <FavoriteQuestionList />
                            </div>
                        )}
                        {activeTabKey === "achievements" && (
                            <div className="tab-content coming-soon">
                                <div className="coming-soon-content">
                                    <h3>成就系统开发中...</h3>
                                    <p>敬请期待更多精彩功能</p>
                                </div>
                            </div>
                        )}
                        {activeTabKey === "settings" && (
                            <div className="tab-content coming-soon">
                                <div className="coming-soon-content">
                                    <h3>设置功能开发中...</h3>
                                    <p>敬请期待更多精彩功能</p>
                                </div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            <EditProfileModal
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                onSubmit={handleEditProfile}
                initialValues={{
                    userName: user.userName || "",
                    userProfile: user.userProfile || "",
                    userEmail: user.userEmail,
                    userAvatar: user.userAvatar || "",
                }}
            />

            <button
                style={{
                    position: 'fixed',
                    right: 32,
                    bottom: 32,
                    zIndex: 1000,
                    background: '#1677ff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: 56,
                    height: 56,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: 24,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={() => message.info('欢迎反馈建议！可加QQ群：123456789')}
                title="我要反馈"
            >
                <span role="img" aria-label="feedback">💬</span>
            </button>
        </div>
    )
}

