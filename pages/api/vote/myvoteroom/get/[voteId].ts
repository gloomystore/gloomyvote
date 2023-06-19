import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../db/mysql';
import { RowDataPacket } from 'mysql2';

export default async function getVisitorHit(req: NextApiRequest, res: NextApiResponse) {
  try {
    const voteId:string = req.query.voteId as string
    const [vote] = await pool.query<RowDataPacket[]>(`SELECT * FROM vote WHERE owner='${voteId}'`);
    // const [votemenu] = await pool.query<RowDataPacket[]>(`SELECT * FROM votemenu WHERE parentId='${voteId}'`);
    // const [voter] = await pool.query<RowDataPacket[]>(`SELECT * FROM voter WHERE parentId='${voteId}'`);

    // const count = rows;
    res.status(200).json({vote});
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
    // res.status(500).json({ error });
  }
}