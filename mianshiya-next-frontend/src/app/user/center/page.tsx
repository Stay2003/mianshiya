"use client"
import { Avatar, Button, Card, Col, Row, Tag, Tooltip, Descriptions, message } from "antd"
import { useSelector } from "react-redux"
import type { RootState } from "@/stores"
import Title from "antd/es/typography/Title"
import { useState } from "react"
import { EditOutlined, IdcardOutlined, MailOutlined, UserOutlined } from "@ant-design/icons"
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
            if (res.data?.code === 0) {
                message.success("更新成功")
                setIsEditModalVisible(false)
                // TODO: 更新 Redux 中的用户信息
            } else {
                message.error(res.data?.message || "更新失败")
            }
        } catch (error) {
            message.error("操作失败，请重试")
        }
    }

    return (
        <div className="user-center-container">
            <div className="user-center-content">
                <Row gutter={[24, 24]}>
                    <Col xs={24} md={6}>
                        <Card className="user-profile-card">
                            <div className="user-avatar-wrapper">
                                <Avatar src={user.userAvatar} size={96} className="user-avatar" />
                            </div>
                            <div className="user-info">
                                <Title level={4} className="user-name">
                                    {user.userName}
                                </Title>
                                <Tooltip title="用户ID">
                                    <Tag icon={<IdcardOutlined />} color="blue" className="user-id-tag">
                                        {user.id}
                                    </Tag>
                                </Tooltip>
                            </div>
                            <Descriptions column={1} className="user-info-descriptions" size="small">
                                <Descriptions.Item label={<UserOutlined />}>{user.userName}</Descriptions.Item>
                                <Descriptions.Item label={<MailOutlined />}>{user.userEmail || "未设置邮箱"}</Descriptions.Item>
                                <Descriptions.Item label="简介">{user.userProfile || "这个人很懒，什么都没写~"}</Descriptions.Item>
                            </Descriptions>
                            <Button 
                                icon={<EditOutlined />} 
                                onClick={() => setIsEditModalVisible(true)}
                                className="edit-profile-button"
                            >
                                编辑资料
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} md={18}>
                        <UserStats {...userStats} />
                        <Card
                            className="user-content-card"
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
                                <div className="tab-content empty-state">
                                    <div className="empty-icon">🏆</div>
                                    <p>成就系统开发中...</p>
                                </div>
                            )}
                            {activeTabKey === "settings" && (
                                <div className="tab-content empty-state">
                                    <div className="empty-icon">⚙️</div>
                                    <p>设置功能开发中...</p>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </div>

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
        </div>
    )
}

