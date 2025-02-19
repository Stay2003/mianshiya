# 数据库初始化

-- 创建库
create database if not exists mianshiya;

-- 切换库
use mianshiya;

-- 用户表
create table user
(
    id           bigint auto_increment comment 'id'
        primary key,
    userAccount  varchar(256)                           not null comment '账号',
    userPassword varchar(512)                           not null comment '密码',
    unionId      varchar(256)                           null comment '微信开放平台id',
    mpOpenId     varchar(256)                           null comment '公众号openId',
    userName     varchar(256)                           null comment '用户昵称',
    userAvatar   text                                   null comment '用户头像',
    userProfile  varchar(512)                           null comment '用户简介',
    userRole     varchar(256) default 'user'            not null comment '用户角色：user/admin/ban',
    editTime     datetime     default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime   datetime     default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime   datetime     default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete     tinyint      default 0                 not null comment '是否删除',
    userEmail    varchar(256)                           null comment '邮箱'
)
    comment '用户' collate = utf8mb4_unicode_ci;

create index idx_unionId
    on user (unionId);


-- 题库表
create table question_bank
(
    id          bigint auto_increment comment 'id'
        primary key,
    title       varchar(256)                       null comment '标题',
    description text                               null comment '描述',
    picture     text                               null comment '图片',
    userId      bigint                             not null comment '创建用户 id',
    editTime    datetime default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime  datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete    tinyint  default 0                 not null comment '是否删除',
    viewNum     int      default 0                 not null comment '浏览量'
)
    comment '题库' collate = utf8mb4_unicode_ci;

create index idx_title
    on question_bank (title);


-- 题目表
create table question
(
    id         bigint auto_increment comment 'id'
        primary key,
    title      varchar(256)                       null comment '标题',
    content    text                               null comment '内容',
    tags       varchar(1024)                      null comment '标签列表（json 数组）',
    answer     text                               null comment '推荐答案',
    userId     bigint                             not null comment '创建用户 id',
    editTime   datetime default CURRENT_TIMESTAMP not null comment '编辑时间',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除',
    favourNum  int      default 0                 not null comment '收藏数'
)
    comment '题目' collate = utf8mb4_unicode_ci;

create index idx_title
    on question (title);

create index idx_userId
    on question (userId);


-- 题库题目表（硬删除）
create table question_bank_question
(
    id             bigint auto_increment comment 'id'
        primary key,
    questionBankId bigint                             not null comment '题库 id',
    questionId     bigint                             not null comment '题目 id',
    userId         bigint                             not null comment '创建用户 id',
    createTime     datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint questionBankId
        unique (questionBankId, questionId)
)
    comment '题库题目' collate = utf8mb4_unicode_ci;


-- 用户收藏题目表
create table question_favour
(
    id         bigint auto_increment comment '主键ID'
        primary key,
    questionId bigint                             not null comment '题目ID',
    userId     bigint                             not null comment '创建用户ID',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除'
)
    comment '用户收藏题目表' collate = utf8mb4_unicode_ci;

create index idx_question_id
    on question_favour (questionId);

create index idx_user_id
    on question_favour (userId);

-- 留言板表
create table message_board
(
    id         bigint auto_increment comment 'id'
        primary key,
    content    text                               not null comment '留言内容',
    userId     bigint                             not null comment '留言用户id',
    questionId bigint                             not null comment '关联的题目id',
    likeCount  int      default 0                 not null comment '点赞数',
    reportCount int     default 0                 not null comment '举报数',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDelete   tinyint  default 0                 not null comment '是否删除'
)
    comment '留言板' collate = utf8mb4_unicode_ci;

create index idx_userId
    on message_board (userId);

create index idx_questionId
    on message_board (questionId);