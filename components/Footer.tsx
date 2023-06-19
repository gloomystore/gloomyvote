'use client'
import { useCallback, useEffect } from 'react'
import styles from '@/styles/Footer.module.scss'
import Image from 'next/image'
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// visitor의 타입
type Visitor = {
  IDX: number;
  TODAY: number;
  TODAY_HIT: number;
  REGDATE: number;
};
type Visitor2 = {
  IDX: number;
  TOTAL: number;
  TOTAL_HIT: number;
  REGDATE: number;
};

// 시간을 계산하는 함수
function getDates(){
  // 1. 현재 시간(Locale)
  const curr = new Date();

  // 2. UTC 시간 계산
  const utc = 
        curr.getTime() + 
        (curr.getTimezoneOffset() * 60 * 1000);

  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

  const today = new Date(utc + (KR_TIME_DIFF)); // 오늘
  const year = today.getFullYear();
  let month = (today.getMonth()+1).toString();
  let date = today.getDate().toString();
  
  if(month.length === 1) month = '0'+ month;
  if(date.length === 1) date = '0'+ date;
  const fullDate = `${year}-${month}-${date}`
  
  const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
  const yesterdayYear = yesterday.getFullYear();
  let yesterdayMonth = (yesterday.getMonth()+1).toString();
  let yesterdayDate = yesterday.getDate().toString()
  
  if(yesterdayMonth.length === 1) yesterdayMonth = '0'+ yesterdayMonth;
  if(yesterdayDate.length === 1) yesterdayDate = '0'+ yesterdayDate;
  const fullYesterday = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDate}`

  // 시간 구하기
  let hour = today.getHours().toString()
  let minute = today.getMinutes().toString()
  let second = today.getSeconds().toString()
  if(hour.length === 1) hour = '0'+ hour;
  if(minute.length === 1) minute = '0'+ minute;
  if(second.length === 1) second = '0'+ second;
  const fullDateTime = `${fullDate} ${hour}:${minute}:${second}`
  
  return [fullDate,fullYesterday,fullDateTime]
}

export default function Footer() {
  const fetchStatistics = useCallback(async() => {
    try {
      // get ip
      const ipRes = await axios.get('https://blog.gloomy-store.com/php/getIp.php');
      const ip = ipRes.data;
      const [todayDate, yesterdayDate,fullDateTime] = getDates();
      const data = {
        DATETIME:fullDateTime,
        DATE:todayDate,
        YESTERDAY:yesterdayDate,
        IPADDRESS:ip,
      }
      // console.log(data)
      const res =  await axios.post<(Visitor | Visitor2)[]>(`/api/updateVisitor`,data)
      if (!res.data) {
        throw new Error("Failed to fetch Statistics");
      }
      const [todayObj, totalObj] = res.data;
      let todayHit = 0;
      let totalHit = 0;
      if ("TODAY" in todayObj) {
        todayHit = todayObj.TODAY
      }
      if ("TOTAL" in totalObj) {
        totalHit = totalObj.TOTAL
      }
      return [todayHit,totalHit];
    } catch (error:any) {
      throw new Error(error.message);
    }
  },[])
  const queryStatistics = useQuery(['statistics'], fetchStatistics, {
    refetchOnWindowFocus: false,
    retry: 0, 
    onSuccess: data => {
      // console.log(data);
    },
    onError: (e:Error) => {
      console.log(e.message);
    }
  });
  const fetchStatisticsIsLoading = queryStatistics.isLoading
  const fetchStatisticsIsError = queryStatistics.isError
  const fetchStatisticsError = queryStatistics.error
  const fetchStatisticsData = queryStatistics.data

  return (
    <footer className={`${styles["footer"]}`} id="contact">
    <div className={`${styles["footer-inner"]}`}>
      <article className={`${styles["footer-logo"]}`}>
        <a className="img-box" href="#!" onClick={e=>window.scrollTo(0,0)}>
          <Image src={require("/public/images/logo2.png")} alt="logo" className='onlyPC' />
          <Image src={require("/public/images/logo3.png")} alt="logo" className='onlySP' />
        </a>
      </article>
      <article className={`${styles["footer-desc"]}`}>
        {fetchStatisticsIsLoading ? (
          <div>Loading...</div>
        ) : (
          fetchStatisticsIsError ? (
            <div>404</div>
          ) : (
            fetchStatisticsData && (
              <h5>
                글루미투표
                <em>
                  <span>today: {fetchStatisticsData[0]}</span>
                  <span>total: {fetchStatisticsData[1]}</span>
                </em>
              </h5>
            )
          )
        )}
        <p><a href="tel:01043431354">TEL : 010-4343-1354</a></p>
        <p><a href="mailto:serenity90s@naver.com">EMAIL : serenity90s@naver.com</a></p>
        <p>COPYRIGHT © 2019 YOUNG e Design CO., LTD. All Rights Reserved. Designed by YOUNG e Design</p>
      </article>
    </div>
  </footer>
  )
}
