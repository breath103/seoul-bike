# seoul-bike
서울시 자전거 따릉이를 위한 모바일에 최적화된 웹사이트 입니다.
https://bike.sympathique.me/

따릉이를 사용하는 대부분의 사람들이 내 주변 거치대를 찾기위해 모바일에서 앱을 사용할텐데([공식 사이트](https://www.bikeseoul.com/)),  
이게 모바일에서는 도저히 제대로 된 사용이 불가능한 수준의 조악한 웹사이트 입니다. 결제야 [어른의 사정](https://namu.wiki/w/%EC%96%B4%EB%A5%B8%EC%9D%98%20%EC%82%AC%EC%A0%95)으로 그렇다 치더라도  
일상적으로 써야하는 "나에게 가까운 거치대 확인" 조차 안되어 있는건
1. 웹사이트 만드는데는 이렇게 돈을 써놓고 이것만 안 만든게 이해도 안가고 
2. 제가 사용하기 빡쳐서 

이부분을 제대로된 기능으로 만들어 제공하려는 목적으로 만들었습니다.  

유일한 기능은 **내 주변의 거치대 목록 및 잔여 자전거 수 표시** 이며, 이 데이터는 현재 5분단위로 업데이트 됩니다.

# 개인정보
사용자의 위치정보는 사용자 단말기의 browser에만 저장되며, 외부로 공유되지 않습니다.

# 라이센스
현재는 AWS와 Google Firebase를 통해 무료로 호스팅 되고 있어, 별도의 유지비용이 없기에 무료로 제공합니다.

# 화면
<div>
<img width="30%" src="https://github.com/breath103/seoul-bike/raw/master/docs/site.png" />
<span> </span>
<img width="30%" src="https://github.com/breath103/seoul-bike/raw/master/docs/site-share.png" />
<span> </span>
<img width="30%" src="https://github.com/breath103/seoul-bike/raw/master/docs/pwa.png" />
</div>

위와 같이 Add to home screen을 이용해 web app으로 사용할수 있습니다.

# 기술 스택

### Frontend Application
Vue.js 와 webpack으로 구성된 template을 사용했고, 배포는 Firebase static hosting을 사용합니다

### Backend Application
Vingle에서 사용중인 [microservice-template](https://github.com/balmbees/lambda-microservice-template) 에 S3와 Lambda, Cloudwatch를 이용하여 5분에 한번씩 현재 거치대 정보를 읽어 s3에 저장합니다.
