import axios from 'axios';
import { ApiURL } from './url';

export interface UserHistory {
  score: number;
  subs: [number, number, number];
  time: number;
}

export async function getHistory(user: string): Promise<UserHistory[]> {
  const data = await axios.get(`${ApiURL}/history/${user}`);
  return data.data.data as UserHistory[];
}
