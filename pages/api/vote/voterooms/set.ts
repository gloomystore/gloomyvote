import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import pool from '../../db/mysql';
import { RowDataPacket } from 'mysql2';
import { randomId } from '@/libs/randomId';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // 솔트를 생성하기 위한 라운드 수 (추천: 10 이상)
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}


export default async function setVoteRoom(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uuid, voteId, title, votes, ip, pass, device, formattedExpirationDate, formattedDestroyDate } = req.body;
    const hashedPassword = await hashPassword(pass);
    const createVoteQuery = await pool.query<RowDataPacket[]>(
      'INSERT INTO vote (uuid, owner, title, ownerip, ownerdevice, password,  expire, destroy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [uuid, voteId, title, ip, device, hashedPassword, formattedExpirationDate, formattedDestroyDate]
    );
    
    const createVoteMenuQueries = votes.map((vote: any) => {
      const { idx, value } = vote;
      return [
        'INSERT INTO votemenu (parentid, uuid, content, voteindex, destroy) VALUES (?, ?, ?, ?, ?)',
        [uuid, randomId(), value, idx, formattedDestroyDate]
      ];
    });
    
    await Promise.all(createVoteMenuQueries.map(([query, params]: any) => pool.query(query, params)));

    res.status(200).json({ message: '투표 데이터가 성공적으로 등록되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '투표 데이터 등록에 실패했습니다.' });
  }
}