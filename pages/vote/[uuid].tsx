'use client'
import React, { useCallback, useEffect, useState } from "react";
import Head from 'next/head'
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "@/libs/cookie";
import { shareKakao } from "@/libs/shareKakao";
import axios from "axios";

import styles from '@/styles/vote.module.scss'

import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import getIp from "@/libs/getIp";
import Router from "next/router";

type vote = {
  content: string,
  destroy: string,
  idx: number,
  parentid: string,
  uuid: string,
  voteindex: string,
  percent: (number | null)
  percentBar: (number | null)
}
type voter = {
  destroy: string,
  idx: number,
  ip: string,
  parentid: string,
  selectnumber: number,
  userdevice: string,
  uuid: string,
}

// 1. uuid를 SSR을 위한 props로 전달하려는 목적
// 2. 유효하지 않은 투표번호면 404페이지를 노출시키기 위함
export const getServerSideProps: GetServerSideProps<{ uuid: (string | null) }> = async (ctx: GetServerSidePropsContext) => {
  try {
    const { uuid } = ctx.query;
    const validation = (await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/vote/voterooms/get/${uuid}`)).data.vote;
    if (validation) {
      return {
        props: {
          uuid: uuid as string
        }
      };
    } else {
      return {
        notFound: true // 404 페이지 반환
      };
    }
  } catch (err: any) {
    console.log(err.message);
  }
  return {
    notFound: true // 404 페이지 반환
  };
};
const Todos = ({uuid}:{uuid:string}) => {
  const [alreadyVoted, setAlreadyVoted] = useState(false) // 이미 투표 했는지
  const [votemenu, setVotemenu]:[votemenu,Function] = useState([]) // 투표 checked 여부 확인을 위한 배열
  const [myVoteId, setMyVoteId]:[votemenu,Function] = useState([]) // 내 투표id세팅
  const [voteResultData, setVoteResultData]:[any,Function] = useState(null) // 화면에 뿌려줄 투표 결과
  const [totalVoter, setTotalVoter]:[any,Function] = useState(0) // 총 몇 명이서 투표 했는지
  const [selected, setSelected]:[any, Function] = useState(null)
  const [key ,setKey] = useState(0);
  // uuid -> parentID, 즉 투표 부모id를 뜻함
  const fetchTodoList = useCallback(async() => {
    try {
      const response = await axios(`/api/vote/voterooms/get/${uuid}`);
      if (!response.data) {
        throw new Error("Failed to fetch todos");
      }
      return response.data;
    } catch (error:any) {
      throw new Error(error.message);
    }
  },[uuid]) 
  const fetchVote = useQuery([uuid,key], fetchTodoList, {
    refetchOnWindowFocus: false, // 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 재실행 여부.
    retry: 0, // 실패시 재호출 몇번 할지
    onSuccess: data => {
      console.log(data);
      let total = 0
      const resultObj:any = {}
      data.voter.forEach((elm:voter)=> {
        total++;
        if(resultObj[elm.selectnumber]) resultObj[elm.selectnumber]++
        else resultObj[elm.selectnumber] = 1;
      })
      let max = Math.max(...(Object.values(resultObj) as number[]))
      let newVoterMenu = [...data.votemenu];
      newVoterMenu = newVoterMenu.map(e=> {
        if(resultObj[e.voteindex]) return {...e, percent:resultObj[e.voteindex]/total * 100, percentBar:resultObj[e.voteindex]/max * 100}
        else return {...e,percent:0}
      })
      setVoteResultData(newVoterMenu)
    },
    onError: (e:Error) => {
      // 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출)
      // 강제로 에러 발생시키려면 api단에서 throw Error 날리면됨 (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
      console.log(e.message);
    }
  });
  const fetchVoteData = fetchVote.data
  const fetchVoteIsLoading = fetchVote.isLoading
  const fetchVoteIsError = fetchVote.isError
  const fetchVoteError = fetchVote.error

  type votemenu = {
    content: string,
    destroy: string,
    idx: number,
    parentid: string,
    uuid: string,
    voteindex: number,
    checked: boolean
  }[]

  // react query를 통해서 들고온 데이터의 변화가 있을 때
  useEffect(() => {
    if(fetchVoteData && fetchVoteData.vote) {
      // 내 투표아이디를 가져와서, 내 투표 기록이 있는지 배열로 뽑아냄
      const voteId = getCookie('voteId')
      setMyVoteId(voteId)
      const myVote = fetchVoteData.voter.filter((voter:any) => {
        return voter.uuid === voteId
      })

      // 총 몇명 참여했는지 계산
      let total = 0;
      fetchVoteData.voter.forEach(() => {
        total++
      })
      setTotalVoter(total)

      // 이미 투표를 했으면 결과를 표시
      const targetDate = new Date(fetchVoteData.vote.expire);
      const currentDate = new Date();
      if(myVote.length > 0) {
        // 내가 이미 투표한 기록이 있으면 결과를 표시
        setAlreadyVoted(true)
        
        setSelected(myVote[0].selectnumber)
      } else if(currentDate > targetDate) {
        setAlreadyVoted(true)
      }
    }
    if(fetchVoteData && fetchVoteData.votemenu) {
      const newVotemenu = fetchVoteData.votemenu.map((e:any)=> {
        return {...e, checked:false}
      })
      setVotemenu(newVotemenu)
    }
  }, [fetchVoteData])
  
  useEffect(()=>{
    setKey(prev => prev + 1)
  },[alreadyVoted])
  useEffect(()=>{
    const kakaoScript = document.createElement('script')
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js'
    kakaoScript.async = true;
    document.body.appendChild(kakaoScript);
    return () => {document.body.removeChild(kakaoScript);}
  },[alreadyVoted])

  function onChangeInput(e:React.ChangeEvent) {
    const { uuid } = (e.target as HTMLInputElement).dataset
    const newVotemenu = [...votemenu].map((e:any)=> {
      if(e.uuid === uuid) return {...e, checked: true}
      else return {...e, checked: false}
    });
    setVotemenu(newVotemenu)
  }
  function onVote(e:React.MouseEvent) {
    const voteChecked = votemenu.filter(vote => vote.checked === true) // 하나라도 체크를 했는지 여부 - 0 or 1
    if(!voteChecked.length) return alert('보기에 하나라도 체크를 해주세요')
    else {
      const makeFetchData = async() => {
        const voteCheckedObj = voteChecked[0]
        const selectnumber = voteCheckedObj.voteindex
        const parentid = voteCheckedObj.parentid
        const ip = (await getIp()).data
        const userdevice = navigator.userAgent
        let destroy = voteCheckedObj.destroy.replace('T',' ')
        destroy = destroy.replace(/\.(\d+)Z/,'')
        const data = {
          parentid,
          ip,
          uuid:myVoteId,
          selectnumber,
          userdevice,
          destroy,
        }
        console.log(data)
        const response = await axios.post('/api/vote/commit',data);
        if (response.data !== 'code0') {
          throw new Error("Failed to fetch vote");
        }
        setAlreadyVoted(true)
      }
      makeFetchData()
    }
  }

  function onDelete(e:React.MouseEvent) {
    const pass = prompt('투표 제작 당시에 만든 비밀번호를 입력해주세요');
    if(pass) {
      const fetchDelete = async() => {
        console.log(pass)
        console.log(uuid)
        const data = {
          pass,
          uuid
        }
        const deleteResponse = (await axios.post('/api/vote/deletevote',data)).data
        if(deleteResponse === 'code0') {
          alert('삭제 완료')
          Router.push('/')
        } else {
          alert('삭제 실패')
        }
      }
      fetchDelete()
    }
  }
//http://local.gloomy-store.com:5100/vote/20230619125343858_20781
  function onClipBoard() {
    const text = `https://vote.gloomy-store.com/vote/${uuid}`
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('복사 되었습니다.') // 실제로는 appBridge를 통해 토스트 메세지로 보내야함
  }
  
  if (fetchVoteIsLoading) {
    return <span>Loading...</span>;
  }

  else if (fetchVoteIsError) {
    return <span>Error: {fetchVoteError?.message}</span>;
  }

  return (
    <>
      <Head>
        <title>Gloomy Chat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className="wrap pt-100">
        <section className="section fadeInUp active blink mt-100 pb-30">
          <h2 className="title-03 mt-0" id="intro">투표번호는 <br className="onlySP" /> {uuid} <br className="onlySP" /> 입니다.</h2>
          <button className={`mt-30 ${styles['copy-text']}`} onClick={onClipBoard} title="주소 복사하기">주소 복사하기</button>
          <div className={`mt-50 ${styles['vote-room']}`}>
          {
          alreadyVoted ? 
            <article className={`form-underlined dark`}>
              <h3 className='mt-10'><input type="text" placeholder={fetchVoteData.vote.title} readOnly className="w-100" /></h3>
              <div className='mt-30'>
                {
                  voteResultData.map((vote:vote, idx:number) =>
                  <p key={idx} className={`w-100 ${styles['vote-result']}`}>
                    <span className={styles['vote-result__content']} title={vote.content}>{vote.content}</span>
                    <span className={styles['vote-result__voted']}>
                      {
                        selected === idx && <b>선택함</b>
                      }
                      {(vote.percent)?.toFixed(0)}%
                    </span>
                    <span className={`w-${vote.percentBar} ${styles['vote-result__bar']}`}></span>
                  </p>
                  )
                }
              </div>
              <div className='mt-30'>
              <p>
                <input type="number" placeholder={'투표기간: '+ fetchVoteData.vote.expire.split('T')[0]+' '+fetchVoteData.vote.expire.split('T')[1].split('.')[0]} min={1} max={7} className="w-100" readOnly />
              </p>
              </div>
            </article>
            :
            <article className={`form-underlined dark`}>
              <h3 className='mt-10'><input type="text" placeholder={fetchVoteData.vote.title} readOnly className="w-100" /></h3>
              <div className='mt-30'>
                {
                  votemenu.map((vote:any, idx:number) =>
                  <p key={idx}>
                    <label htmlFor={'vote'+idx}>
                      <input type="radio" name='vote' id={'vote'+idx} data-uuid={vote.uuid} onChange={onChangeInput} />
                      <span>{vote.content}</span>
                    </label>
                  </p>
                  )
                }
              </div>
              <div className='mt-30'>
              <p>
                <input type="number" placeholder={'투표기간: '+ fetchVoteData.vote.expire.split('T')[0]+' '+fetchVoteData.vote.expire.split('T')[1].split('.')[0]} min={1} max={7} className="w-100" readOnly />
              </p>
              </div>
              <div className='mt-30'>
                <button onClick={onVote}>투표하기</button>
              </div>
            </article>
            }
            <div className="mt-30">
              <p className="t-white">총 참가수: {totalVoter}명</p>
            </div>
            <div className='mt-30'>
              <button onClick={onDelete}>삭제하기</button>
            </div>
          </div>
          <article className={styles["kakao"]}>
            <h4>이 투표방 카카오톡에 공유하기</h4>
            <button onClick={() => shareKakao(`https://vote.gloomy-store.com/vote/${uuid}`, fetchVoteData.vote.title)} className="mt-20">
              <img className="w-100" src={`${process.env.NEXT_PUBLIC_API_URL}/images/kakao.png`} alt={"Kakao Logo"} />
            </button>
          </article>
        </section>
      </div>
      <Footer />
    </>
  );
};
export default Todos