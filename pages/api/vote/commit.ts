import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../db/mysql';
import { RowDataPacket } from 'mysql2';

// 소중한 한 표를 행사하는 api
export default async function commitVote(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {parentid, ip, uuid, selectnumber, userdevice, destroy } = req.body;
    const createVoteQuery = await pool.query<RowDataPacket[]>(
      'INSERT INTO voter (parentid, uuid, ip, selectnumber, userdevice, destroy) VALUES (?, ?, ?, ?, ?, ?)',
      [parentid, uuid, ip, selectnumber, userdevice, destroy]
    );
    res.status(200).json('code0');
  } catch (error) {
    console.error(error);
    res.status(500).json('code1');
  }
}