<template>
  <transition name="fade">
    <div class="about">
      <div class="backdrop"></div>
      <div class="content">
        <section>
          <div>
            <h2>도움말</h2>
            <p>
              이 사이트는 서울시 자전거 <a href="https://www.bikeseoul.com"><b>따릉이</b></a> 를 위한 거치대 찾기 서비스 입니다.
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
            <h3>개인정보</h3>
            <p>사용자의 위치정보는 사용자 단말기의 browser에만 저장되며, 외부로 공유되지 않습니다.</p>
          </div>

          <div>
            <h3>사용권</h3>
            <ul>
              <li>현재는 AWS와 Google Firebase를 통해 무료로 호스팅 되고 있어, 별도의 유지비용이 없기에 무료로 제공합니다.</li>
              <li>이 사이트는 <a href="https://github.com/breath103/seoul-bike"><b>오픈소스</b></a>로 제공됩니다.</li>
            </ul>
          </div>

          <div>
            <h3>개발자</h3>
            <img style="max-width: 200px" src="/static/img/photos/louie.jpg" />
            <div class="contact">
              <span style="padding-right:0.5em">Kurt Lee</span><a href="mailto:breth103@gmail.com"><i class="material-icons">email</i></a>
            </div>
          </div>

          <div class="copyright-footer">
            © {{ new Date().getFullYear() }} Sympathique
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'About'
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

  background: rgba(29, 29, 29, 0.82);
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
