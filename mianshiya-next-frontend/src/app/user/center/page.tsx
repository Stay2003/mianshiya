"use client";
import {Avatar, Button, Card, Col, Row, Tag, Tooltip, Descriptions, message} from "antd";
import {useSelector} from "react-redux";
import {RootState} from "@/stores";
import Title from "antd/es/typography/Title";
import {useState} from "react";
import {EditOutlined, IdcardOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import {updateMyUserUsingPost} from "@/api/userController";
import "./index.css";
import UserStats from "@/app/user/center/components/UserStats";
import CalendarChart from "@/app/user/center/components/CalendarChart";
import EditProfileModal from "@/app/user/center/components/EditProfileModal";

export default function UserCenterPage() {
    const loginUser = useSelector((state: RootState) => state.loginUser);
    const user = loginUser;
    const [activeTabKey, setActiveTabKey] = useState<string>("record");
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    // 模拟用户统计数据
    const userStats = {
        totalQuestions: 156,
        streak: 7,
        achievements: 12,
    };

    const handleEditProfile = async (values: API.UserUpdateMyRequest) => {
        try {
            const res = await updateMyUserUsingPost(values);
            // @ts-ignore
            if (res.code === 0) {
                message.success('更新成功');
                setIsEditModalVisible(false);
                // TODO: 更新 Redux 中的用户信息
            } else {
                // @ts-ignore
                message.error(res.message || '更新失败');
            }
        } catch (error) {
            message.error('操作失败，请重试');
        }
    };

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div id="userCenterPage" className="max-width-content">
            <Row gutter={[16, 16]}>
                <Col xs={24} md={6}>
                    <Card style={{textAlign: "center"}}>
                        <Avatar src={user.userAvatar} size={72}/>
                        <div style={{marginBottom: 16}}/>
                        <Card.Meta
                            title={
                                <div style={{marginBottom: 8}}>
                                    <Title level={4} style={{marginBottom: 4}}>
                                        {user.userName}
                                    </Title>
                                    <Tooltip title="用户ID">
                                        <Tag icon={<IdcardOutlined/>} color="blue">
                                            {user.id}
                                        </Tag>
                                    </Tooltip>
                                </div>
                            }
                            description={
                                <>
                                    <Descriptions
                                        column={1}
                                        className="user-info-descriptions"
                                        size="small"
                                    >
                                        <Descriptions.Item label={<UserOutlined/>}>
                                            {user.userName}
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<MailOutlined/>}>
                                            {user.userEmail || '未设置邮箱'}
                                        </Descriptions.Item>
                                        <Descriptions.Item label="简介">
                                            {user.userProfile || '这个人很懒，什么都没写~'}
                                        </Descriptions.Item>
                                    </Descriptions>
                                    <div style={{marginTop: 16}}>
                                        <Button
                                            icon={<EditOutlined/>}
                                            onClick={() => setIsEditModalVisible(true)}
                                        >
                                            编辑资料
                                        </Button>
                                    </div>
                                </>
                            }
                        />
                    </Card>
                </Col>
                <Col xs={24} md={18}>
                    <UserStats {...userStats} />
                    <Card
                        tabList={[
                            {
                                key: "record",
                                label: "刷题记录",
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
                            setActiveTabKey(key);
                        }}
                    >
                        {activeTabKey === "record" && (
                            <>
                                <CalendarChart/>
                            </>
                        )}
                        {activeTabKey === "achievements" && (
                            <div style={{minHeight: 200, textAlign: "center", padding: 20}}>
                                成就系统开发中...
                            </div>
                        )}
                        {activeTabKey === "settings" && (
                            <div style={{minHeight: 200, textAlign: "center", padding: 20}}>
                                设置功能开发中...
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
                    userName: user.userName || '',
                    userProfile: user.userProfile || '',
                    userEmail: user.userEmail,
                    userAvatar: user.userAvatar || '',
                }}
            />
        </div>
    );
}

