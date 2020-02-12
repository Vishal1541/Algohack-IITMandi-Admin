<template>
  <div>
    <div class="login-container" v-if="!loading">
      <Header />
      <b-col sm="4" offset="4">
        <b-form class="login-form">
          <center>
            <h2>Admin Login</h2>
          </center>
          <b-form-group id="input-group-2" label="Username:" label-for="input-2">
            <b-form-input id="input-2" v-model="form.username" required></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="Password:" label-for="input-3">
            <b-form-input id="input-3" v-model="form.password" type="password" required></b-form-input>
          </b-form-group>

          <center>
            <b-button variant="primary" class="btn" @click="login()">Login</b-button>
            <b-button type="reset" variant="danger" class="btn">Reset</b-button>
          </center>
        </b-form>
      </b-col>
    </div>
  </div>
</template>

<script>
import router from '../router';
import axios from 'axios';
import { mapActions } from "vuex";
import Header from "../views/Header.vue";

export default {
  data() {
    return {
      loading: true,
      id: null,
      form: {
        username: '',
        password: ''
      }
    }
  },
  components: {
    Header
  },
  methods: {
    login() {
      const username = this.form.username;
      const password = this.form.password;
      const data = { username: username, password: password };
      axios.post('/api/auth/login', data)
        .then(() => {
          // console.log("Login", res);
          router.push('/dashboard');
        })
        .catch((err) => {
          console.log(err);
        })
    },
    ...mapActions(["updateUserSession"]),
    toDashboard() {
      router.push('/dashboard');
    }
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id) {
        router.push('/dashboard');
      } else {
        this.loading = false;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style scoped>
.login-form {
  margin-top: 100px;
}
.btn {
  margin-left: 10px;
}
</style>
