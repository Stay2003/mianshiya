import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Input, message, Popconfirm, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
import {
  deleteMessageUsingDelete,
  listMessageManageUsingGet,
  pinMessageUsingPost,
  searchMessageUsingGet,
} from '@/api/messageBoardController';
import type { UserVO } from '@/api/typings';

const AdminMessagePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.MessageBoardManageVO[]>([]);
  const [total, setTotal] = useState(0);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');

  const fetchData = async (page = current, size = pageSize) => {
    try {
      setLoading(true);
      const res = await listMessageManageUsingGet({
        current: page,
        pageSize: size,
      });
      if (res.data?.code === 0 && res.data?.data) {
        setData(res.data.data.records || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await searchMessageUsingGet({
        current: 1,
        pageSize,
        searchText,
      });
      if (res.data?.code === 0 && res.data?.data) {
        setData(res.data.data.records || []);
        setTotal(res.data.data.total || 0);
        setCurrent(1);
      }
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteMessageUsingDelete({ id });
      if (res.data?.code === 0) {
        message.success('删除成功');
        fetchData();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handlePin = async (id: number) => {
    try {
      const res = await pinMessageUsingPost({ id });
      if (res.data?.code === 0) {
        message.success('操作成功');
        fetchData();
      }
    } catch (error) {
      message.error('操作失败');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: ColumnsType<API.MessageBoardManageVO> = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: '内容',
      dataIndex: 'content',
      width: 300,
      ellipsis: true,
    },
    {
      title: '用户',
      dataIndex: 'user',
      width: 120,
      render: (user: UserVO) => user?.userName || '-',
    },
    {
      title: '点赞数',
      dataIndex: 'likeCount',
      width: 100,
    },
    {
      title: '举报数',
      dataIndex: 'reportCount',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'isPinned',
      width: 100,
      render: (isPinned: boolean) => (
        <Tag color={isPinned ? 'blue' : 'default'}>
          {isPinned ? '已置顶' : '未置顶'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      width: 200,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确定要删除这条评论吗？"
            onConfirm={() => handleDelete(record.id!)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => handlePin(record.id!)}
          >
            {record.isPinned ? '取消置顶' : '置顶'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="搜索评论内容"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
          />
        </Space>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current,
            pageSize,
            total,
            onChange: (page, size) => {
              setCurrent(page);
              setPageSize(size);
              fetchData(page, size);
            },
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default AdminMessagePage; 