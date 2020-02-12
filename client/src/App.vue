<template>
  <div id="app">
    <div class="content">
      <center>
        <h1>CodeHack - IIT Mandi</h1>
      </center>
      <hr />
      <b-container>
        <!-- <router-link :to="{ name: 'Dashboard'}">Dashboard</router-link>
        <Login />-->
        <!-- <Footer /> -->
        <router-view />
      </b-container>
    </div>
    <footer class="footer">
      <hr />
      <center>&copy; 2020, Vishal Anand</center>
    </footer>
  </div>
</template>

<script>
// import Header from './views/Header.vue';
// import Login from './views/Login.vue';
// import Dashboard from './views/Dashboard.vue';
// import Footer from './views/Footer.vue';
import { mapActions } from "vuex"
import router from "./router"

export default {
  name: 'App',
  data() {
    return {
      id: null
    }
  },
  methods: {
    ...mapActions(["updateUserSession"])
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }
}
</script>

<style>
html,
body {
  height: 96%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 20px;
}
.content {
  flex: 1 0 auto;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
  padding: 20px;
}

.footer {
  flex-shrink: 0;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
  padding: 20px;
}
</style>
