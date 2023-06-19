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
          <Link href="/makevote" className='f-right'>투표 만들기</Link>
          </h2>
          <p className="t-13">(쿠키를 삭제하면 사라집니다! 주의!)</p>
          <div className={`ly-flex-wrap mt-50 ${styles['vote-box__wrap']}`}>
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
          <h1>사용한 기술:
            <pre>
mysql, nextjs13, 쿠키, react query, 카카오 공유
            </pre>

          </h1>
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
                      <Image src={require("/public/images/icon/html2.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">HTML5</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      웹표준 및 웹접근성을 준수하며, 최상의 SEO를 위한 태그를 작성합니다. 검색노출을 위한 적절한 타이틀 사용과 최적의 HTML구조, 스크린리더를 위한 정확한 태그사용 등 모든 면에 대응합니다. 
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
                      반복문과 변수사용 및 코드 중복 방지를 위한 모듈입니다. 체계적으로 SASS를 작성할 경우 다크모드나 기타 상황에서 쉽게 color를 변경 가능합니다. SCSS 문법을 사용합니다.
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
                      화살표함수, 스프레드연산자, const, let 등을 사용하며, this의 바인딩과 TDZ에 유의하며 스크립트를 작성합니다. ES5 및 ES6 스펙의 스크립트에 대응합니다. 바벨을 사용하지 않는 환경의 경우, 또한 ie까지 대응하는 경우 ES5 스펙으로 작성합니다. 이벤트 루프를 이해하며, 순서에 맞는 스크립트 작성에 유의합니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/next.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Next.js</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                      SSG의 장점을 살려, 최대한 Server side에서 많은 정보를 제공하도록 스크립트를 작성합니다. 예를 들어, 게시판의 경우, getServerSideProps로 간단한 작성 내용을 넣어둡니다. 구글 외 검색로봇은 게시글 하나하나의 내용을 server side에서 이해하도록 조치합니다. 클라이언트에 모든 스크립트가 다운로드 되어 hydrate 되었을 때, 달라지는 내용은 style밖에 없도록 노력합니다.
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
                    엄격한 타입 적용을 위해, 컴파일 단계에서 에러를 잡기 위해 사용합니다. 되도록 any를 사용하지 않도록 노력하고 있습니다.
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
                    전역 상태 관리를 위해 사용하고 있습니다. props가 전달되는 범위가 넓어질 때, redux로 상태관리를 진행합니다.
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
                      <Image src={require("/public/images/icon/php.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">PHP</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                    기본적인 CRUD를 알고있습니다. 게시판 제작 경험이 있으며, 실제 자체 제작 블로그에 PHP가 사용되고 있습니다. 로그인의 경우 쿠키와 세션으로 관리합니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/nodejs.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Node.js</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                    express를 사용하여, 클라이언트에서 오는 각종 요청에 대해 처리합니다. 기본적으로는 PHP와 같이 간단한 CRUD를 처리하며, 클라이언트사이드 언어인 자바스크립트로 서버사이드까지 다룰 수 있는 점에 주목하고 있습니다.
                    </p>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/nodejs.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">Node.js</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                    express를 사용하여, 클라이언트에서 오는 각종 요청에 대해 처리합니다. 기본적으로는 PHP와 같이 간단한 CRUD를 처리하며, 클라이언트사이드 언어인 자바스크립트로 서버사이드까지 다룰 수 있는 점에 주목하고 있습니다.
                    </p>
                  </td>
                  <th scope="row">
                    <div className="th-wrap">
                      <Image src={require("/public/images/icon/mongodb.png")} width="60" height="60" alt="skills" className="th-img" />
                      <p className="th-title">mongoDB</p>
                    </div>
                  </th>
                  <td>
                    <p className="td-desc onlyTab">
                    데이터가 json 그 자체이며, nodejs서버 상에서 객체를 자유롭게 다룰 수 있기 때문에 SQL과 마찬가지로 간단한 CRUD가 가능합니다.
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
