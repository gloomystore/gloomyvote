
import styles from '@/styles/NavBar.module.scss'
// import {useRouter} from 'next/router'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { scrollBlock } from "@/store/stores/scrollBlock";
import { setCookie, getCookie } from "@/libs/cookie";
import { randomId } from "@/libs/randomId";
import Image from 'next/image'
// import Link from 'next/link'

export default function NavBar() {
  // const router = useRouter()
  const [navActive,setNavActive] = useState(false)
  function moveScroll(id:string) {
    // if(document.querySelector(`#${id}`)) {
    //   const top = document.querySelector(`#${id}`).getBoundingClientRect().top - 120;window.scrollTo(0,window.scrollY + top)
    //   if(navActive){
    //     setNavActive(false)
    //   }
    // }
  }
  function handleNav(){
    setNavActive(!navActive)
  }

  // redux 
  const dispatch = useDispatch();
  const scrollBlockState = useSelector((state:any) => state.scroll);
  const loadState = useSelector((state:any) => state.load);
  const [scrollStyle,setScrollStyle] = useState(` `)

  useEffect(() => {
    if(!loadState) return
    dispatch(scrollBlock(navActive)); // redux에 test라는 state에 babo1을 넣는다.
    if(scrollBlockState){
      setScrollStyle(`
      html {
        height: 100vh;
        overflow-y: hidden;
      }
      `)
    } else {
      setScrollStyle(``)
    }
  }, [navActive,scrollBlockState,loadState])

  // 모달 관련
  const [activeModal, setActiveModal] = useState(false)

  function acceptCookie() {
    setCookie('cookieAccepted','true',null)
    const voteId = randomId()
    setCookie('voteId',voteId, null)
    setActiveModal(false)
  }
  useEffect(()=>{
    const cookieAccepted = getCookie("cookieAccepted");
    if(!cookieAccepted) setActiveModal(true)
  },[])


  function goHome(){
    window.location.href = '/'
  }

  return (
    <>
      <nav className={navActive ? `${styles['nav']} ${styles['active']}`  : `${styles['nav']}` }>
        <h2 className={`${styles['nav-logo']}`}>
          <a href="#!" onClick={goHome} title="페이지 제일 위로" className={`${styles['navv']} img-box`}>
            <Image src={require("/public/images/logo2.png")} alt="logo" className='onlyPC' />
            <Image src={require("/public/images/logo3.png")} alt="logo" className='onlySP' />
          </a>
        </h2>
        <ul className={`${styles['nav-list']} onlyPC`}>
          <li>
            <a href='#!' onClick={()=>moveScroll('intro')}>Intro</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('skill')}>Skill</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('portfolio')}>Portfolio</a>
          </li>
          <li>
            <a href='#!' onClick={()=>moveScroll('contact')}>Contact</a>
          </li>
        </ul>
        <div className={`${styles['nav-inner']} onlySP`}>
          <button className={navActive ? `${styles['nav-hamburger']} ${styles['active']} onlySP` : `${styles['nav-hamburger']} onlySP`} onClick={handleNav} title="메뉴 열기/닫기">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <article className={navActive ? `${styles['nav-menu']} ${styles['active']}` : `${styles['nav-menu']}`}>
            <ul className={`${styles['nav-list-mobile']}`}>
              <li>
                <a href='#!' onClick={()=>moveScroll('intro')}>Intro</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('skill')}>Skill</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('portfolio')}>Portfolio</a>
              </li>
              <li>
                <a href='#!' onClick={()=>moveScroll('contact')}>Contact</a>
              </li>
            </ul>
          </article>
        </div>
      </nav>
      <article className={activeModal ? "modal active" : "modal"}>
        <div className="modal-dimmed"></div>
        <div className="modal-content blink">
          <h3>쿠키 정책 안내</h3>
          <p className="mt-20">이 사이트에 들어온 순간, 당신은 보안정책과 쿠키정책에 동의한 걸로 간주됩니다. 왜냐하면 당신의 정보를 알아야 중복 투표를 방지할 수 있으니깐요.</p>
          <p className="mt-20">수집하는 정보: 아이피, 사용하는 기기의 정보</p>
          <p className="mt-20">쿠키에 저장하는 정보: 당신의 투표여부</p>
          <div className="modal-button">
            <button onClick={acceptCookie}>확인</button>
          </div>
        </div>
      </article>
      {
        scrollBlockState &&
        <style>
          {scrollStyle}
        </style>
      }
      
    </>
  )
}
