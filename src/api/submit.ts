import axios from 'axios';
import { message } from 'antd';
import { ApiURL } from './url';
import type { LeaderBoardData } from './leaderboard';

export interface SubmitData {
  user: string;
  avatar?: string;
  content: string;
}

export async function submit(data: SubmitData): Promise<LeaderBoardData[]> {
  const ret = await axios.post(`${ApiURL}/submit`, data);
  if (ret.data?.code !== 0) {
    message.error(`请求失败，错误码${ret.data?.code ?? ret.status}`);
    return Promise.reject();
  } else {
    return ret.data.data.leaderboard as LeaderBoardData[];
  }
}
