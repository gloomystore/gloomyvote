import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import pool from '../db/mysql';
import { RowDataPacket } from 'mysql2';

async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

export default async function deleteVote(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { uuid, pass } = req.body;
    const parentid = uuid
    
    // 비밀번호 해싱값 가져오기
    const [[passwordRow]] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM vote WHERE uuid = ?',
      [uuid]
    );
    // return res.status(200).json(passwordRow)
    const hashedPassword = passwordRow.password
    
    // 비밀번호 검증
    const verify = await verifyPassword(pass,hashedPassword)
    if(verify) {
      await pool.query(
        'DELETE FROM vote WHERE uuid = ?',
        [uuid]
      );
      
      // 투표자 데이터 삭제
      await pool.query(
        'DELETE FROM voter WHERE parentid = ?',
        [parentid]
      );
      
      // 투표 메뉴 데이터 삭제
      await pool.query(
        'DELETE FROM votemenu WHERE parentid = ?',
        [parentid]
      );
      return res.status(200).json('code0')
    }
    else {
      return res.status(200).json('code1')
    }
    // ... 이후 코드
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '삭제실패' });
  }
}