import React, { useEffect, useState } from 'react';
import { Avatar, Button, Form, Input, message, Modal, Table, Timeline, Upload } from 'antd';
import { LikeOutlined, UploadOutlined } from '@ant-design/icons';
import useSWR from 'swr';
import { ApiURL, setApiURL, getLeaderBoard, getHistory, submit, vote } from './api';
import './App.css';

import type { ColumnsType } from 'antd/es/table';
import type { LeaderBoardData } from './api';

const columns: ColumnsType<LeaderBoardData & { update: (data: LeaderBoardData[]) => void }> = [
  {
    title: 'ID',
    dataIndex: 'user',
    key: 'ID',
    render: (value: LeaderBoardData['user'], record) => (
      <div
        onClick={async () => {
          const history = await getHistory(value);
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
            title: `${value} 的历史提交`,
          });
        }}
      >
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

function App() {
  const [api, setApi] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);
  const { data: leaderBoard, mutate } = useSWR(confirmed ? 'leaderboard' : null, getLeaderBoard);
  useEffect(() => {
    const modal = Modal.confirm({
      afterClose: () => {
        message.info(`当前 API: ${ApiURL}`);
        setConfirmed(true);
      },
      content: (
        <Form>
          <Form.Item label="API 地址">
            <Input placeholder={ApiURL} value={api} onChange={e => setApi(e.target.value)} />
          </Form.Item>
        </Form>
      ),
      title: '设置API地址',
      onOk: () => {
        api && setApiURL(api);
      },
    });
    return modal.destroy;
  }, []);
  const [submitForm] = Form.useForm();
  console.log(submitForm);

  return (
    <div>
      <header className="header-container">
        <p className="web-title">SAST 2022 PyTorch Homework Leaderboard</p>
      </header>
      <div className="content">
        <Button
          icon={<UploadOutlined />}
          onClick={() => {
            Modal.info({
              content: (
                <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} form={submitForm}>
                  <Form.Item name="user" label="学号" required>
                    <Input />
                  </Form.Item>
                  <Form.Item name="content" label="result.txt" required>
                    <Upload maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>点击选择文件</Button>
                    </Upload>
                  </Form.Item>
                  <Form.Item name="avatar" label="上传头像">
                    <Upload maxCount={1} beforeUpload={() => false}>
                      <Button icon={<UploadOutlined />}>点击选择文件</Button>
                    </Upload>
                  </Form.Item>
                </Form>
              ),
              onOk: () =>
                submitForm
                  .validateFields()
                  .then(async values => {
                    const base64 = async (file: File) => {
                      let binary = '';
                      const bytes = new Uint8Array(await file.arrayBuffer());
                      for (let i = 0; i < bytes.length; ++i) {
                        binary += String.fromCharCode(bytes[i]);
                      }
                      return btoa(binary);
                    };
                    const submitData = {
                      user: values.user as string,
                      content: (await values.content.file.text()) as string,
                      avatar: values.avatar?.file && (await base64(values.avatar.file)),
                    };
                    await submit(submitData)
                      .then(data => mutate(data, { revalidate: false }))
                      .catch(() => {});
                  })
                  .catch(err => message.error(JSON.stringify(err?.errorFields) ?? 'unknwon error')),
              title: '提交',
            });
          }}
          type="primary"
        >
          提交
        </Button>
        <Table
          columns={columns}
          dataSource={leaderBoard?.map(item => ({
            ...item,
            update: (data: LeaderBoardData[]) => mutate(data, { revalidate: false }),
          }))}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default App;
