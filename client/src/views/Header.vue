<template>
  <div>
    <b-nav>
      <!-- <b-nav-item v-if="id" @click="dashboard">Dashboard</b-nav-item> -->
      <b-nav-item v-if="id" @click="logout">Log out</b-nav-item>
      <!-- <b-nav-item disabled>Disabled</b-nav-item> -->
    </b-nav>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      id: null
    }
  },
  methods: {
    logout() {
      axios.post('/api/auth/logout')
        .then(() => {
          // console.log('Logged out!');
          router.push("/");
        })
        .catch((err) => {
          console.log(err);
        })
    },
    ...mapActions(["updateUserSession"]),
    dashboard() {
      router.push("/dashboard");
    }
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
