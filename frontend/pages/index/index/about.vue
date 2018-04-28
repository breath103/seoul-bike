<template>
  <div class="about">
    <div class="backdrop"></div>
    <div class="content" @click="goBack()">
      <section>
        <div>
          <h2>도움말</h2>
          <p>
            이 사이트는 서울시 자전거 <a @click.stop href="https://www.bikeseoul.com"><b>따릉이</b></a> 를 위한 거치대 찾기 서비스 입니다.
          </p>
        </div>

        <div>
          <h3>웹사이트 버젼</h3>
          <p>
            이 사이트는 <b>{{ releaseDate.toLocaleString() }}</b> 에 배포되었습니다.
          </p>
        </div>

        <div>
          <h3>사용 안내</h3>
          <ul>
            <li>거치대의 잔여 자전거 숫자는 5분 단위로 업데이트 됩니다</li>
            <li>반납 가능 대수는 표시되지 않으며,<br/>따릉이는 이미 주차된 자전거에 다시 연결해서 반납이 가능하기 때문입니다</li>
          </ul>
        </div>

        <div>
          <h3>왜 만든건가요?</h3>
          <p>
            따릉이를 사용하는 서울 시민들은 대부분 내 주변 거치대를 찾기위해 모바일에서 앱을 사용할텐데(<a @click.stop href="https://www.bikeseoul.com/"><b>공식 사이트</b></a>)<br/>
            이게 모바일 에서는 도저히 사용이 불가능한 아주 조악한 웹앱 입니다.<br/>
            결제야 <a @click.stop href="https://namu.wiki/w/%EC%96%B4%EB%A5%B8%EC%9D%98%20%EC%82%AC%EC%A0%95"><b>어른의 사정</b></a>으로 그렇다 치더라도<br/>
            일상적으로 써야하는 "나에게 가까운 거치대 확인" 조차 안되어 있는건<br/>
            <br/>
            1. 웹사이트 만드는데는 이렇게 세금 써놓고 이것만 안 만든게 이해도 안가고<br/>
            2. 제가 사용하기 빡쳐서<br/>
            이걸 제대로된 제품으로 만들어 제공하기 위해 만들었습니다.<br/>
          </p>
        </div>

        <div>
          <h3>개인정보</h3>
          <p>사용자의 위치정보는 사용자 단말기의 browser에만 저장되며, 외부로 공유되지 않습니다.</p>
        </div>

        <div>
          <h3>사용권</h3>
          <ul>
            <li>현재는 AWS와 Google Firebase를 통해 무료로 호스팅 되고 있어, 별도의 유지비용이 없기에 무료로 제공합니다.</li>
            <li>이 사이트는 <a @click.stop href="https://github.com/breath103/seoul-bike"><b>오픈소스</b></a>로 제공됩니다.</li>
          </ul>
        </div>

        <div>
          <h3>개발자</h3>
          <img style="max-width: 200px" src="/img/photos/louie.jpg" />
          <div class="contact">
            <span style="padding-right:0.5em">Kurt Lee</span><a @click.stop href="mailto:breth103@gmail.com"><i class="material-icons">email</i></a>
          </div>
        </div>

        <div class="copyright-footer">
          © {{ new Date().getFullYear() }} Sympathique
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  // transition: "fade",
  methods: {
    goBack() {
      this.$router.push("/");
    }
  },
  data() {
    return {
      releaseDate: new Date(process.env.RELEASE_DATE),
    }
  },
  head() {
    return {
      title: "사용안내",
      meta: [
        { property: "og:url",
          content: `${process.env.HOST}/about` },
        { hid: 'description', name: 'description', content: 'Seoul Bike 사용안내' }
      ]
    }
  }
}
</script>

<style lang="scss">
.backdrop {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  // filter: blur(5px);
  // -webkit-backdrop-filter: blur(5px);

  background: rgba(29, 29, 29, 0.92);
}

.about {
  color: white;
}

.content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: scroll;

  transform: translate(0, 0);
  word-break: keep-all;

  a {
    color: #03CC8B;
    text-decoration: none;
  }

  section {
    margin: 20px 15px;

    h3 {
      margin-top: 2em;
      margin-bottom: 0.5em;
    }

    ul {
      margin: 0;
    }
  }

  .contact {
    display: flex;
    align-items: center;
  }

  .copyright-footer {
    text-align: center;
    margin-top: 6em;
    color: #d0d0d0;
  }
}

.page-enter-active, .page-leave-active {
  transition: opacity .5s;
}
.page-enter, .page-leave-to {
  opacity: 0;
}
</style>
