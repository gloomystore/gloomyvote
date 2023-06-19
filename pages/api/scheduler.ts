import { NextApiRequest, NextApiResponse } from 'next';
import schedule from 'node-schedule';
import pool from './db/mysql';
import winston from 'winston';

// 로그 파일 경로 설정
const logFilePath = '/volume1/web/gloomy-store/www/react/gloomyvote/log';

// 로그 출력 형식 설정
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// 로그 설정
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: `${logFilePath}/app.log`,
      maxsize: 1048576, // 최대 파일 크기 (1MB)
      maxFiles: 30, // 최대 보관 파일 수 (30일치)
      tailable: true, // 파일을 여러 번 열어 계속 로깅
      zippedArchive: true, // 압축된 아카이브 파일 생성
    })
  ]
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 스케줄 작업 생성: 매일 자정에 실행
  const job = schedule.scheduleJob('0 0 * * *', async () => {
    try {
      const currentTime = new Date();
      
      // destroy 컬럼이 현재 시간보다 이전인 row를 삭제
      await pool.query(
        'DELETE FROM vote WHERE destroy < ?',
        [currentTime]
      );
      await pool.query(
        'DELETE FROM votemenu WHERE destroy < ?',
        [currentTime]
      );
      await pool.query(
        'DELETE FROM voter WHERE destroy < ?',
        [currentTime]
      );

      // 처리 내용 로그 저장
      logger.info('Scheduled task completed');

    } catch (error) {
      console.error(error);
      // 오류 로그 저장
      logger.error('Scheduled task failed');
    }
  });

  // 요청 시 현재 스케줄 작업 상태를 반환
  res.status(200).json({ scheduled: job ? true : false });
}