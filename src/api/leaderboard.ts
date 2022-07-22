import axios from 'axios';
import { ApiURL } from './url';

export interface LeaderBoardData {
  user: string;
  score: number;
  subs: [number, number, number];
  time: number;
  avatar?: string;
  votes: number;
}

export async function getLeaderBoard(): Promise<LeaderBoardData[]> {
  const data = await axios.get(`${ApiURL}/leaderboard`);
  return data.data as LeaderBoardData[];
}
