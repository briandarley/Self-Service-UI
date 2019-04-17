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
    routes: [
        
        // {
        //     path: '/home',
        //     name: 'Home',
        //     title: "Home",
        //     icon: 'fa-info-circle',
        //     component: Home
        // },
        // {
        //     path: '/test',
        //     name: 'Test',
        //     title: 'Test',
        //     component: Test
        // },
        // {
        //     path: '*',
        //     //name: 'information',
        //     //redirect: '/information',
        //     component: Home
        // }
    ]



});

router.beforeEach((to, from, next) => {

    router.currentRouteName = to.Name;
    next();
});


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