import Vue from 'vue';
import Router from 'vue-router';

import Home from '@/components/Home';
import About from "@/components/About";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        path: '/about',
        name: 'About',
        components: {
          overlay: About
        }
      }]
    }
  ]
});
