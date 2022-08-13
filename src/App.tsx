import React, { useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import { ApiURL, setApiURL } from './api';
import './App.css';

import { LeaderBoard } from './LeaderBoard';
import { Submit } from './submit';

function App() {
  const [visible, setVisible] = useState(true);
  const [api, setApi] = useState<string>();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div>
      <Modal
        title="设置API地址"
        onOk={() => {
          api && setApiURL(api);
          message.info(`当前 API: ${ApiURL}`);
          setConfirmed(true);
          setVisible(false);
        }}
        visible={visible}
      >
        <Form>
          <Form.Item label="API 地址">
            <Input placeholder={ApiURL} value={api} onChange={e => setApi(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <header className="header-container">
        <p className="web-title">SAST 2022 PyTorch Homework Leaderboard</p>
      </header>
      <div className="content">
        <Submit />
        <LeaderBoard confirmed={confirmed} />
      </div>
    </div>
  );
}

export default App;
