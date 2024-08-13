# Portfolio - 글루미투표

![Project Image](https://cdn.gloomy-store.com/gloomyvote/apple5.webp)

## Concept
- **PWA (Progressive Web App)**
- **React Query** (서버 상태 관리)
- **MySQL**
- **Next.js 13**
- **쿠키 관리**
- **카카오톡 공유 기능**

## Frontend
- **Framework:** Next.js 13
- **State Management:** React Query

## Backend
- **Framework:** Next.js 13

## Database
- **Database:** MariaDB (MySQL)

## Deployment
- **Deployment Environment:** 자택 개인서버 (NAS)

## 제작참여도
- **기획:** 100%
- **디자인:** 100%
- **FE개발:** 100%
- **BE개발:** 100%


## 사용방법
- 사용자의 정보는 접속 후 쿠키를 허용하는 순간부터 고유한 아이디로 저장됩니다.
- 투표를 만들고, 카카오톡으로 공유할 수 있습니다.
- 정말 쉽습니다. 투표를 제작하고 링크를 공유하세요.
- 자유로운 익명투표의 시작입니다.


## [클릭 / 입장해보기](https://vote.gloomy-store.com)


## 포트폴리오 설명

### 프론트엔드

![Frontend Image](https://cdn.gloomy-store.com/gloomyvote/content001.webp)

- `getServerSideProps`를 통해 투표의 UUID를 확인 후, 해당 데이터가 없으면 커스텀 404 페이지로 안내합니다.
- 데이터가 존재하면, 실제 투표 페이지로 안내됩니다.
- 투표 데이터는 React Query를 통해 fetch하며, React Query Devtools로 데이터 송수신 상태를 확인할 수 있습니다.

이 프로젝트는 `pm2`를 이용해 `.env.development` 환경에서 `npm run dev`로 실행 중입니다. (Build하지 않음)

![Frontend Image](https://cdn.gloomy-store.com/gloomyvote/content003.webp)

- 투표를 간편하게 생성할 수 있으며, 언제든지 자유롭게 생성 가능합니다.
  
![Frontend Image](https://cdn.gloomy-store.com/gloomyvote/content003.webp)
![Frontend Image](https://cdn.gloomy-store.com/gloomyvote/content007.webp)

- 투표를 하면 DB에 내용이 업데이트되고, React Query의 의존성 배열에 따라 한 번 더 fetch가 이루어집니다. 이후 투표 결과 화면이 송출됩니다.
- 사용자의 데이터는 쿠키에 저장되며, 랜덤으로 배정된 고유한 UUID를 ID처럼 사용합니다. 이미 투표한 경우, 투표 결과를 보여줍니다.

![Backend Image](https://cdn.gloomy-store.com/gloomyvote/content005.webp)
![Backend Image](https://cdn.gloomy-store.com/gloomyvote/content006.webp)

- 투표 URL 복사 및 카카오톡 공유가 가능합니다.
- 모바일과 PC 어느 쪽에서도 쉽게 투표 URL을 공유할 수 있습니다.

### 백엔드

![Backend Image](https://cdn.gloomy-store.com/gloomyvote/content008.webp)
![Backend Image](https://cdn.gloomy-store.com/gloomyvote/content009.webp)

- **DB 설계:** 비록 백엔드 전문가가 아니지만, DB를 설계하고 효율적인 환경을 구축하기 위해 연구했습니다.
  
  - **vote table:** 투표의 개요를 저장합니다.
  - **votemenu table:** 해당 투표의 보기를 저장하며, `parentid`로 `vote` table의 UUID를 추적합니다.
  - **voter table:** 투표자들이 어떤 보기에 투표했는지 저장합니다. 몇 번 보기의 index를 선택했는지만 저장합니다.

- **Backend Process:**
  - 백엔드에서는 데이터를 정제하지 않고, 클라이언트로 전송한 후 클라이언트에서 데이터를 정제하여 map으로 표시합니다.

- **Next.js API:** 네 가지 주요 기능으로 구성됩니다.
  1. 투표 DB 내용을 클라이언트로 전달하는 기능
  2. 쿠키 데이터가 있는 사용자에게 자신이 만든 투표방을 보여주고, 선택한 투표 보기에 `[선택함]`을 노출
     - 쿠키가 제거되면 이 기능은 사용할 수 없게 됩니다.
  3. **투표 삭제 기능:** bcrypt를 사용해 암호화 및 검증을 수행합니다. 올바른 비밀번호를 입력하면 투표가 삭제됩니다.
     - 특정 Flag로 투표를 비노출 시키는 방법도 있으나, row 증가를 방지하기 위해 실제 row를 삭제합니다.
     - 서버 유지비를 감당할 수 있다면, 비노출 방식도 가능합니다.
  4. **투표 관측 기간 만료:** 24시간마다 `scheduler`가 실제 row를 삭제하여 더 이상 투표를 볼 수 없게 합니다.
     - `node-cron`과 `node-schedule` 중 고민했으나, 사용자 수가 많은 후자를 선택했습니다.
