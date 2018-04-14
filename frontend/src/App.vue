<template>
  <div id="app">
    <header>
      <div class="title">Seoul Bike</div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
// document.body.addEventListener(
//   'touchmove', 
//   (event) => event.preventDefault(), 
//   false
// );

export default {
  name: 'app'
}
</script>

<style lang="scss">
body, html {
  padding: 0;
  margin: 0;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

$headerHeight: 50px;
main {
  position: fixed;
  left: 0;
  top: $headerHeight;
  bottom: 0;
  right: 0;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

header {
  margin: 0;
  height: $headerHeight;
  display: flex;
  align-items: center;

  padding: 0px 16px;
  background-color: #35495E;
  color: #ffffff;

  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
