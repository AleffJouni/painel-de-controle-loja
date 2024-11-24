import { createRouter, createWebHistory } from 'vue-router';

// Importar as páginas 
import Dashboard from './components/Dashboard.vue';
import Products from './components/Products.vue';
import Users from './components/Users.vue';
import Carts from './components/Carts.vue';
import Login from "./components/Login.vue";

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/products",
    component: Products,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: "/carts",
    component: Carts,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guarda de rota para verificar autenticação
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;