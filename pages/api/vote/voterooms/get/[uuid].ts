import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../db/mysql';
import { RowDataPacket } from 'mysql2';

export default async function getVisitorHit(req: NextApiRequest, res: NextApiResponse) {
  try {
    const uuid:string = req.query.uuid as string
    const [vote] = await pool.query<RowDataPacket[]>(`SELECT * FROM vote WHERE uuid='${uuid}'`);
    const [votemenu] = await pool.query<RowDataPacket[]>(`SELECT * FROM votemenu WHERE parentId='${uuid}'`);
    const [voter] = await pool.query<RowDataPacket[]>(`SELECT * FROM voter WHERE parentId='${uuid}'`);

    // const count = rows;
    res.status(200).json({vote:vote[0],votemenu,voter});
  } catch (error) {
    console.error(error);
    res.status(500).json({});
    // res.status(500).json({ error });
  }
}