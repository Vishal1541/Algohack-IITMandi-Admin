import Vue from "vue"
import Router from "vue-router"
import Login from "@/views/Login.vue"
import Dashboard from "@/views/Dashboard.vue"
import CreateProblem from "@/views/CreateProblem.vue"

Vue.use(Router);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
  {
    path: "/dashboard/create-problem",
    name: "CreateProblem",
    component: CreateProblem
  },
  {
    path: "*",
    redirect: "/"
  }
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;
