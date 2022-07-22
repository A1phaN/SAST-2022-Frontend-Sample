import axios from 'axios';
import { message } from 'antd';
import { ApiURL } from './url';
import type { LeaderBoardData } from './leaderboard';

export async function vote(user: string): Promise<LeaderBoardData[]> {
  const data = await axios.post(`${ApiURL}/vote`, { user });
  if (data.data?.code !== 0) {
    message.error(`请求失败，错误码${data.data?.code ?? data.status}`);
    return Promise.reject();
  } else {
    return data.data.data.leaderboard as LeaderBoardData[];
  }
}
