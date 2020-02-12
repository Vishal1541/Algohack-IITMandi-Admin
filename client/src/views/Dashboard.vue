<template>
  <div>
    <div v-if="!loading">
      <Header />
      <div v-if="got_details">
        <p>Admin: {{ user.name }}</p>
      </div>
      <div v-else>Loading...</div>
      <b-col sm="6" offset="3">
        <div>
          <center>
            <h3>My problems</h3>
          </center>
          <b-table :items="items" :fields="fields">
            <template v-slot:cell(first_name)="data">
              <router-link :to="`/dashboard/edit/${data.value}`">{{data.value}}</router-link>
            </template>
          </b-table>
        </div>
      </b-col>
    </div>
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
      },
      fields: ['first_name', 'last_name', 'age'],
      items: [
        { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        { age: 89, first_name: 'Geneva', last_name: 'Wilson' }
      ]
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
