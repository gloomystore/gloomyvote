export const shareKakao = (route:string, title:string) => { // url이 id값에 따라 변경되기 때문에 route를 인자값으로 받아줌
  const kakao = (window as any).Kakao; // window 객체에 Kakao가 없을 경우를 대비하여 any 타입으로 선언
  if (kakao) {
    if (!kakao.isInitialized()) {
      kakao.init(process.env.NEXT_PUBLIC_SHARE_KAKAO_LINK_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
    }

    kakao.Link.sendDefault({
      objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
      content: {
        title: title, // 인자값으로 받은 title
        description: title, // 인자값으로 받은 title
        imageUrl: "https://blog.gloomy-store.com/images/logo3.png",
        link: {
          mobileWebUrl: route, // 인자값으로 받은 route(uri 형태)
          webUrl: route
        }
      },
      buttons: [
        {
          title: "title",
          link: {
            mobileWebUrl: route,
            webUrl: route
          }
        }
      ]
    });
  }
};