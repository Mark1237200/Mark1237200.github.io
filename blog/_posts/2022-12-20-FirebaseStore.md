---
layout: posts
title: "Firebase FireStore"
date: 2022-12-20
categories:
  - Firebase
tags: ["Yapick", "트러블 슈팅", "firebase"]
---

무사히 깃허브 페이지로 배포까지 성공했지만 아직 흰 화면에 404 에러를 띄우고있다.

<br>

![6-1.png](/assets/img/6-1.png)

<br>
<br>

가장먼저 생각한것이 서버를 열어야 겠다라는 생각이였고 (어차피 해야함) firebase 를 import 해 실시간으로 조작시 DB 에 저장되게 설정하고

설정 종료후에도 404 가 해결이 안되나 확인해 보기로 했다. ~~안될거 앎~~

## firebase

firebase 에 로그인 후 프로젝트 웹을 추가해줬다.

<br>

![6-2.png](/assets/img/6-2.png)

<br>

SDK 추가 하는도중 api key 등의 값들은 private 이기 때문에 .env 파일에 각 값들을 적어주고 env 에서 끌어쓰도록 했다 (REACT_APP 으로 시작하는 환경변수만 인식한다고 한다 react 에서는)

```javascript
//.env
REACT_APP_FB_API_KEY = "";
REACT_APP_FB_AUTH_DOMAIN = "";
REACT_APP_FB_PROJECT_ID = "";
REACT_APP_FB_STORAGE_BUCKET = "";
REACT_APP_FB_MESSAGING_SENDER_ID = "";
REACT_APP_FB_API_ID = "";

//firebase.js
import firebase from "firebase";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_API_ID,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { firebase, firebaseApp, db };
```

<br>

이제 Database 를 건들여볼까 하는데 Firebase 에는 Realtime Database 와 Firesotre Database 가 있다.

간단하게 말하자면 Firestore Database 가 최근에 나온거며 거의 모든 면에서 Realtime Database 보다 개선되었다고 볼수 있기에 Realtime Database 의 대체제로 Firestore Database 를 먼저 배워 사용하는걸 추천했다.

<br>

컬렉션을 추가하여 필드와 값을 추가하면 된다. 우리에게 익숙한 db.json 형식으로 추가하였다.

<br>

![6-3.png](/assets/img/6-3.png)

<br>

app.js 에 연동해 console.log 로 열어보려니 모듈을 찾지 못한다.

흔한 업데이트 이슈로 스택오버플로우 형님들꺼를 보고 경로를 수정해줬다.

```javascript
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
```

정상적으로 작동하며 콘솔로도 잘 불러와진다 !

<br>

![6-4.png](/assets/img/6-4.png)

나는 database 에서 get 으로 데이터를 가져다가 쓰고싶다.

REST 호출은 공식문서에서 **"모든 REST API 엔드포인트는 기본 URL https://firestore.googleapis.com/v1/"** 에 존재하며 이와같이

```
https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/cities/LA
```

<br>

![6-5.png](/assets/img/6-5.png)

<br>

드디어 성공했다 ! 이대로 constants 에 api.js 를 손 봐주고 json-server 로 해둔 api 주소들을 수정해주면 이제 끝이다.

<br>

이 이후 일주일 넘게 소요하여 프로젝트는 준완성 되었는데, 우선 나는 어떻게든 저 **API 를 사용하고자** console.log(data) 로 불러내어
promise result 의 data 값을 꺼내기위해 고군분투 하였다..

<br>

그 후에 이 방법은 틀렸다고 인정하고 다양한 검색 끝에 firebase.js 에 코드를 적은 코드로 내 firestore 의 database 에 근접하는게 가능한걸 깨닳았다.

파이어베이스는 자기들만의 옵션으로 접근할수 있도록 공식 문서에 적혀있었고.. 해당 내용이 어려워 지나쳤던거 같았다.

firebase.js 에 export 한 db 변수는 -> .collection() 으로 firestore 에 적은 컬렉션을 가져와 get() 그리고 data() 로 접근 할수 있었다.

<br>

쉽게 설명하자면,

```javascript
import { db } from "../../../utils/firebase";

useEffect(() => {
  db.collection("store") // 컬렉션 name
    .get()
    .then((e) => {
      e.forEach((store) => {
        // foreEach 로 문서 안 데이터들을 호출
        setTruck(store.data()); // data 로 내가 적은 객체를 확인 가능
      });
    });
}, []);
```

이러하여 팀원들과 만든 Yapick 에 실시간으로 서버를 연결시켜 주었지만, F5 로 새로고침시 데이터가 날라가 비어있게 되는 문제를 발견하였다.

useQuery 로 캐싱하여 세션스토리지에 저장된걸 확인하고 불러와도 해결되지 않았는데, 이 부분은 내가 분명 뭔가를 놓치고 있을거라 장담한다.

<br>

이 이후에도 map 타입 객체로 입력한게 콘솔로 data.data.member 로 호출해도 undefiend 로 읽히는등.. 많은 오류와 대면 하였지만

CRUD 중 R 먼저 해결한걸 배포하기로 하였다. CUD 도 학습중에 있으며 이력서 돌리고 추가할 예정

<br>

Yapick 과 StackOverflow 를 npm run build 로 빌드하여 나온 build 폴더들을 vercel 에 올려

![7-2.png](/assets/img/7-2.png)

포트폴리오에 연결하여 배너 누르고 이미지 클릭시 빌드한 웹사이트로 이동되게 onclick 속성과 a 태그로 href 속성에 링크를 걸어줬다.

<br>

firebase 로 로그인 기능도 추가할수 있다는데... 맨 마지막 순서로 도전해 봐야겠다.
