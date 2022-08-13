import React from 'react';
import { Avatar, Modal, Table, Timeline } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { getLeaderBoard, getHistory, vote } from './api';

import type { ColumnsType } from 'antd/es/table';
import type { LeaderBoardData } from './api';

const showHisotry = async (user: string) => {
  const history = await getHistory(user);
  Modal.info({
    content: (
      <Timeline style={{ marginTop: 20 }}>
        {history.map(data => (
          <Timeline.Item key={data.time}>
            Score: {data.score}
            <br />
            Average: {data.subs.reduce((a, b) => a + b, 0) / data.subs.length}
            <br />
            Mountain: {data.subs[0]}
            <br />
            Sky: {data.subs[1]}
            <br />
            Water: {data.subs[2]}
            <br />
            time: {new Date(data.time * 1000).toLocaleString()}
          </Timeline.Item>
        ))}
      </Timeline>
    ),
    title: `${user} 的历史提交`,
  });
};

const columns: ColumnsType<LeaderBoardData & { update: (data: LeaderBoardData[]) => void }> = [
  {
    title: 'ID',
    dataIndex: 'user',
    key: 'ID',
    render: (value: LeaderBoardData['user'], record) => (
      <div onClick={() => showHisotry(value)}>
        {record.avatar ? (
          <Avatar
            size="small"
            icon={<img src={'data:image/png;base64,' + record.avatar} alt="" />}
          />
        ) : (
          <Avatar size="small">{value}</Avatar>
        )}
        {value}
      </div>
    ),
  },
  {
    title: 'Score',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: 'Last Submit',
    dataIndex: 'time',
    key: 'time',
    render: (value: LeaderBoardData['time']) => new Date(value * 1000).toLocaleString(),
  },
  {
    title: 'Average',
    dataIndex: 'subs',
    key: 'Average',
    render: (value: LeaderBoardData['subs']) => value.reduce((a, b) => a + b, 0) / value.length,
  },
  {
    title: 'Mountain',
    dataIndex: 'subs',
    key: 'Mountain',
    render: (value: LeaderBoardData['subs']) => value[0],
  },
  {
    title: 'Sky',
    dataIndex: 'subs',
    key: 'Sky',
    render: (value: LeaderBoardData['subs']) => value[1],
  },
  {
    title: 'Water',
    dataIndex: 'subs',
    key: 'Water',
    render: (value: LeaderBoardData['subs']) => value[2],
  },
  {
    title: '投票',
    dataIndex: 'votes',
    key: 'vote',
    render: (value: LeaderBoardData['votes'], record) => (
      <div
        onClick={() =>
          vote(record.user)
            .then(record.update)
            .catch(() => {})
        }
      >
        {value}
        <LikeOutlined />
      </div>
    ),
  },
];

export const LeaderBoard: React.FC<{ confirmed: boolean }> = ({ confirmed }) => {
  const { data: leaderBoard, mutate } = useSWR(confirmed ? 'leaderboard' : null, getLeaderBoard);
  return (
    <Table
      columns={columns}
      dataSource={leaderBoard?.map(item => ({
        ...item,
        update: (data: LeaderBoardData[]) => mutate(data, { revalidate: false }),
      }))}
      pagination={false}
    />
  );
};
