import HeadComponent from "@/components/HeadComponent";
import Image from "next/image";
import NavBar from "@/components/NavBar"
import Footer from "@/components/Footer"

export default function NotFound() {


  return (
    <>
      <HeadComponent
      title={'글루미투표'}
      description={'글루미투표 - 글루미 익명 투표입니다. 이 투표 페이지는 익명으로 처리됩니다.'}
      keywords={'javascript, ES6, React, Vue, Nextjs, typescript, 투표'}
      />
      <NavBar />
      <div className="wrap">
        <header className="img-box header mb-100">
          <div className="img-box--words" style={{width:'100%',maxWidth:600, padding:20}}>
            <Image src={require("/public/images/404.webp")} width="375" height="375" alt="profile" priority />
          </div>
        </header>
      </div>
      <Footer todayHit={0} totalHit={0} />
    </>
  )
}
