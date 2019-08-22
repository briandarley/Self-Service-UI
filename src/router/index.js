import Vue from 'vue';
import Router from 'vue-router';
import injector from 'vue-inject';
//import Home from '@/home/home.vue';
// import Test from '@/demo/test.vue';
// import axios from 'axios';
Vue.use(Router);

const router = new Router({
    //mode: 'history',
    base: process.env.BASE_PATH,
    routes: []



});

router.beforeEach((to, from, next) => {

    router.currentRouteName = to.Name;
    next();
});

router.onError(error => {
    if (/loading chunk \d* failed./i.test(error.message)) {
      window.location.reload()
    }
})

function routerService() {
    //RouteSourcesService
    return {
        router: router
    }
}


injector.service('routerService',  routerService);
injector.constant('router', router);

//router.replace({ path: '', redirect: '/' })
export default router