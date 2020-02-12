<template>
  <div>
    <Header />
    <div v-if="!loading">
      <h2>Dashboard</h2>
      <div v-if="got_details">
        <p>User: {{ user.name }}</p>
      </div>
      <div v-else>Loading...</div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
import axios from "axios"
import router from "../router"
import { mapActions } from "vuex"
import Header from "../views/Header.vue"

export default {
  name: "Login",
  data() {
    return {
      id: null,
      loading: true,
      got_details: false,
      user: {
        name: ''
      }
    }
  },
  components: {
    Header
  },
  methods: {
    getUserData: function () {
      axios.get("/api/dashboard/user")
        .then((res) => {
          this.user.name = res.data.user.username;
          this.got_details = true;
        })
        .catch((errors) => {
          console.log(errors)
          router.push("/")
        })
    },
    ...mapActions(["updateUserSession"])
  },
  async mounted() {
    try {
      await this.updateUserSession();
      this.id = this.$store.state.user._id;
      if (this.id !== null) {
        this.getUserData();
        this.loading = false;
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  }
}
</script>
