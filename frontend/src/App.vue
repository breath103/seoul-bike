<template>
  <div id="app">
    <header>
      <div class="title">
        <router-link to="/">Seoul Bike</router-link>
      </div>

      <div style="flex: 1">
      </div>

      <div>
        <router-link to="about">
          <i class="material-icons">help</i>
        </router-link>
      </div>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
  position: fixed;
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

  a {
    color: white;
    text-decoration: none;
  }

  .title {
    font-size: 24px;
    font-weight: bold;
  }
}
</style>
