import HeadComponent from "@/components/HeadComponent";
import { useDispatch, useSelector } from 'react-redux';
import { scrollBlock } from "@/store/stores/scrollBlock";
import { setContentLoad } from "@/store/stores/isLoad";
import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// conponent
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"
import ErrorBoundary from './ErrorBoundary';

// style
import styles from '@/styles/vote.module.scss'

// libs
import { setCookie, getCookie } from "@/libs/cookie";
import { randomId } from "@/libs/randomId";
import Router from "next/router";

export default function Home() {

  /** 로딩, splash 동작 */
  const dispatch = useDispatch();
  type RootState = {
    scroll: boolean
  }
  type RootState2 = {
    load: boolean
  }
  const scrollBlockState = useSelector((state: RootState) => state.scroll);
  const loadState = useSelector((state: RootState2) => state.load);

  
  /** fade요소가 등장할 경우 active를 붙인다 */
  const [activeFades, setActiveFades]: [
    Array<boolean>,
    Function
  ] = useState([false,false,false,false,false,false,false,]);
  const [activeBlink, setActiveBlink]: [
    Array<boolean>,
    Function
  ] = useState([false,false,false,false,false,false,false,]);
  const activeFadeElms: Array<React.RefObject<HTMLDivElement>> = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  useEffect(() => {
    console.log("%cGloomy-store \n %c본 포트폴리오의 모든 interaction은 state로 관리됩니다.","color:#731aed;font-weight:bold;font-size:2rem;line-height:1", "color:#eee;font-weight:100;font-size:0.7rem;");
    onScroll();
    window.addEventListener("scroll", onScroll);
    activeFadeElms.forEach((el,i)=>{
      el.current?.addEventListener("mouseenter", () => {
        const newActiveBlink = activeBlink.map((elm,idx)=>{
          if(i === idx) return true
          else return false
        })
        setActiveBlink(newActiveBlink)
      });
      el.current?.addEventListener("mouseleave", () => {
        const newActiveBlink = activeBlink.map((elm,idx)=>{
          return false
        })
        setActiveBlink(newActiveBlink)
      });
    })
    /** //fade요소가 등장할 경우 active를 붙인다 */
  }, []);

  /* 스크롤 함수 */
  function onScroll() {
    const updatedActiveFades = activeFadeElms.map((el: any, i: number) => {
      if (el.current) {
        const isVisible = el.current.getBoundingClientRect().top + el.current.getBoundingClientRect().height > 0 && el.current.getBoundingClientRect().top < window.innerHeight - 150;
        return isVisible;
      }
    });
    setActiveFades(updatedActiveFades);
  }
  /* //스크롤 함수 */

  // 쿠키 여부에 따라 방 노출
  const [voteRooms, setVoteRooms] = useState([])
  useEffect(()=>{
    const voteId = getCookie("voteId");
    async function getVoterooms() {
      if(voteId) {
        console.log(voteId)
        const res = await axios.post(`/api/vote/myvoteroom/get/${voteId}`)
        console.log(res.data)
        if(res.data.vote) {
          setVoteRooms(res.data.vote)
        }
      }
    }
    getVoterooms();
  },[])

  const [ticketNumber,setTicketNumber] = useState('');
  function onPressEnter(e:React.KeyboardEvent<HTMLInputElement>) {
    if(e.key === 'Enter') {
      goNext()
    }
  }
  function onChangeValue(e:React.ChangeEvent<HTMLInputElement>) {
    setTicketNumber(e.target.value)
  }
  function goNext() {
    Router.push(`/vote/${ticketNumber}`)
  }

  return (
    <>
      <HeadComponent
      title={'글루미투표'}
      description={'글루미투표 - 글루미 익명 투표입니다. 이 투표 페이지는 익명으로 처리됩니다.'}
      keywords={'javascript, ES6, React, Vue, Nextjs, typescript, 투표'}
      />
      <NavBar />
      <div className="wrap pt-75">
        <header className="img-box header mb-100 hp-300">
          <div className="img-box--words">
            <h1>글 루 미 - 투 표</h1>
            <p>간단한 익명 투표</p>
          </div>
        </header>

       <section
          ref={activeFadeElms[0]}
          className={
            activeFades[0]
              ? activeBlink[0]
                ? "section fadeInUp active blink"
                : "section fadeInUp active"
              : "section fadeInUp"
          }
          onMouseEnter={()=>setActiveBlink([true,activeBlink[1]])}
          onMouseLeave={()=>setActiveBlink([false,activeBlink[1]])}
        >
          <h2 className={`title-02 ${styles['title-02']}`} id="intro">내가 만든 투표들
          <Link href="/makevote" className='f-right t-blue'>투표 만들기</Link>
          </h2>
          <p className="t-13">(쿠키를 삭제하면 사라집니다! 주의!)</p>
          <div className="form-underlined mt-25">
            <input type="text" placeholder="투표번호로 입장하기" onKeyDown={onPressEnter} onChange={onChangeValue} value={ticketNumber} />
            <button className="button" onClick={goNext}>입장</button>
          </div>
          <div className={`ly-flex-wrap mt-30 ${styles['vote-box__wrap']}`}>
            {
              // 내가 만든 투표가 있으면 노출
              voteRooms.length > 0 ?
              voteRooms.map((voteData:any,idx:number)=> 
              <article className={`${styles['vote-box']}`} key={idx}>
                <Link href={`/vote/${voteData.uuid}`} className={`${styles['vote-box__division']}`}>
                  <div>
                    <Image src='/images/logo3.png' alt="profile" width={60} height={54} />
                  </div>
                  <div>
                    <div className="ly-flex-wrap justify-between align-center">
                      <h3>{voteData.title}</h3>
                      <p className='mt-10'>{voteData.title}</p>
                    </div>
                    <div className="mt-10">
                      <h4>투표 참가자: {voteData.title}명</h4>
                      <p className='mt-10'>투표 상태: {voteData.title ? '진행중' : '마감'}</p>
                      <p className='mt-10'>투표 번호: {voteData.uuid}</p>
                    </div>
                  </div>
                </Link>
              </article>
              )
              :
              // 내가 만든 투표가 없으면 노출
              <>
                <p>내가 만든 투표가 없거나, 쿠키에서 데이터를 추출할 수 없습니다.</p>
              </>
            }
            
          </div>
        </section>

        <section
          ref={activeFadeElms[1]}
          className={
            activeFades[1]
              ? activeBlink[1]
                ? "section fadeInUp active blink"
                : "section fadeInUp active"
              : "section fadeInUp"
          }
          onMouseEnter={()=>setActiveBlink([activeBlink[0],true])}
          onMouseLeave={()=>setActiveBlink([activeBlink[0],false])}
        >
          <h2 className="title-02" id="skill">Used Stack</h2>
          <h3 className="title-03">FE Stack</h3>
          <div className="table">
            <table summary="summary">
              <caption></caption>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/next.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Next.js</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      본 프로젝트에서는 Nextjs를 사용한 이유는 SSR이나 SSG를 활용하기 보다는, 별도 express 서버를 돌릴 필요 없이 Nextjs 자체만으로도 프론트엔드와 백엔드를 둘 다 처리할 수 있기 때문입니다. <br /> 프론트는 기존의 React와 같게, 백엔드는 투표 데이터를 호출, 삽입, 삭제하는 API의 역할을 맡게 됩니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/sass3.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">SASS&amp;CSS</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      기존 포트폴리오에서 global.scss를 공유하며, 추가적으로 이 프로젝트에서만 쓰이는 vote.module.scss를 사용합니다.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/javascript3.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">ES6</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      배열을 다룰 때, 직접적으로 push, pop을 하는게 아니라 state에 업데이트 시켜서 Virtual DOM과 동기화 하는 점이 조금 까다로웠습니다. 배열의 보기를 삽입/삭제하는 과정에서 스프레드 연산자를 유용하게 사용했습니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/tanstack.webp")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">React-query</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      이제는 tanstack으로 알려진 React query를 서버상태 관리 및 관찰용으로 넣었습니다. fetch의 성공/실패/로딩중 등 관측이 가능하고, 언제 시도했는지, 몇 번째 시도인지 등 서버와의 통신상태를 점검할 수 있습니다. 근데 제 생각에는 생긴 것 자체가 가독성이 좋지는 않은 것 같아요.
                      
                    </p>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/typescript.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Typescript</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      <span>투표 번호로 입장하기 코드▼<br /><i className="t-light" style={{color:'navy'}}>function onPressEnter(e:React.KeyboardEvent&lt;HTMLInputElement&gt;)</i> <br />
                      이벤트 하나를 넣어도 전부 타입을 지정해야한다는게 조금 빡센 점이긴한데, 그래도 컴파일 단계에서 에러를 잡을 수 있다는 점이 얼마나 좋습니까..</span>
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/redux.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Redux</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      사실 전역상태관리까지는 필요없긴 한데, 팝업 나타날 때 스크롤 막으려고 넣어놨습니다. <br />
                      어떤 페이지에서 팝업이 나타나든, body태그 자체에 scroll을 막아야하니깐요.
                    </p>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/chrome.webp")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">cookie</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      사실 쿠키를 기술스택이라 하기 좀 그렇긴한데, 사용자 정보를 식별하기 위해 쿠키에 랜덤번호를 지정해서 저장하는 것으로 사용자를 식별합니다. <br /><br />
                      왜냐하면 Mobile은 IP가 지속적으로 바뀌어서 식별정보로 사용할 수 없으니깐요.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/kakao.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">kakao API</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      본 투표는 카카오톡 공유하기 기능이 있습니다. <br /><br />
                      kakao API는 정해진 src url로 script 태그를 만들면, window객체에 공유하기 관련 기능이 추가됩니다. 거기에 정해진 객체의 format에 맞춰서 메소드를 실행하기만 하면 쉽게 공유가 가능합니다.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="title-03">BE Stack</h3>
          <div className="table">
            <table summary="summary">
              <caption></caption>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/next.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Next.js</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      작은 프로젝트 하는 데에 express까지 만들 필요는 없을 것 같아서 Nextjs 자체로 해결하기로 했습니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/nodejs.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">node-schedule</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      정해진 시간이 되면 MySQL DB를 확인해서 파기날짜가 지난 투표 ROW들을 전부 DELETE 해버립니다. <br />
                      투표 기간 &gt; 결과 확인 기간 &gt; 파기 <br />
                      방장은 투표 생성 시 기간을 정할 수 있습니다.<br /><br />
                      근데 우리집은 가정용 전기라서 24시간에 한 번만 실행하도록 설정해놓았어요.
                    </p>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/maria.webp")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">mariaDB</p>
                    </div>
                  </th>
                  <td colSpan={3}>
                    <p className="td-desc onlyTab">
                      투표 기본정보 테이블, <br />
                      투표 보기 테이블(1번, 2번, 3번...), <br />
                      투표자 테이블, <br />
                      이렇게 세 테이블로 나누어서 제작했습니다. <br /><br />
                      직접 공책에 그려가면서 설계(?)했는데, 쉬운 일은 아니었습니다. 백엔드 개발자분들 대단...
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="title-03">Deployment</h3>
          <div className="table">
            <table summary="summary">
              <caption></caption>
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/synology.png")} width="60" height="60" alt="skills" className="th-img filter-type2" />
                      <p className="th-title">개인서버</p>
                    </div>
                  </th>
                  <td colSpan={3}>
                    <p className="td-desc onlyTab">
                    본 포트폴리오 및 모든 작업물은 개인서버에 띄워져 있습니다. nginx로 리버스 프록시를 적용하여, domain.com/ 은 프론트 서버에, domain.com/api/는 api 서버에 연결되도록 포트번호를 지정합니다.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
