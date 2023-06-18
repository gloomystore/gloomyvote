'use client'
import { useCallback, Suspense } from 'react'
import styles from '@/styles/Footer.module.scss'
import Image from 'next/image'
import { GetServerSideProps } from "next";
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
type Props = {
  statistics: (Visitor | Visitor2)[];
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const [todayDate, yesterdayDate] = getDates();
    const statisticsObj = await axios.get<(Visitor | Visitor2)[]>(`${process.env.API_HOST}/api/getVisitorHit?todayDate=${todayDate}&yesterdayDate=${yesterdayDate}`);
    const statistics = statisticsObj.data;
    console.log(statistics)
    
    return { props: { statistics } };
  } catch (error) {
    console.error(error);
    return { props: { statistics: [] } };
  }
};

export default function Footer() {
  const fetchTodoList = useCallback(async() => {
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
      const res =  await axios.post<(Visitor | Visitor2)[]>(`/api/updateVisitor`,data)
      if (!res.data) {
        throw new Error("Failed to fetch todos");
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
  const fetchStatistics = useQuery(['statistics'], fetchTodoList, {
    refetchOnWindowFocus: false,
    retry: 0, 
    onSuccess: data => {
      // console.log(data);
    },
    onError: (e:Error) => {
      console.log(e.message);
    }
  });
  const fetchStatisticsIsLoading = fetchStatistics.isLoading
  const fetchStatisticsIsError = fetchStatistics.isError
  const fetchStatisticsError = fetchStatistics.error
  const fetchStatisticsData = fetchStatistics.data

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
        <Suspense fallback={<div>Loading...</div>}>
            {fetchStatisticsIsLoading ? (
              <div>Loading...</div>
            ) : (
              <h5>
                글루미투표{' '}
                <em>
                  <span>today: {fetchStatisticsData ? fetchStatisticsData[0] : 0}</span>
                  <span>total: {fetchStatisticsData ? fetchStatisticsData[1] : 0}</span>
                </em>
              </h5>
            )}
          </Suspense>
        <p><a href="tel:01043431354">TEL : 010-4343-1354</a></p>
        <p><a href="mailto:serenity90s@naver.com">EMAIL : serenity90s@naver.com</a></p>
        <p>COPYRIGHT © 2019 YOUNG e Design CO., LTD. All Rights Reserved. Designed by YOUNG e Design</p>
      </article>
    </div>
  </footer>
  )
}
