import Vue from "vue";
import App from "./App.vue";
import injector from "vue-inject";
import "./app_root_dependencies";
import router from "./router";
import {
  VueRouter
} from "./components/index.js";

//require("vue-toastr/src/vue-toastr.scss");
const console = window.console;

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(injector);



new Vue({
  // el: '#app',
  router,
  components: {
    App
  },
  template: `<div class="app"><App></App><vue-toastr ref="toastr"></vue-toastr></div>`,
  data() {
    return {
      currentRoute: "home",
      duoEnabled: null, //,
      //page_header: '',
      //page_header_small: ''
    };
  },

  methods: {
    
    appendChildRoutes(route) {
      if (!route.children) {
        return;
      }
      
    
      route.children.forEach(route => {

        this.createAndAppendRoute(route, this.loadView(route));
        this.appendChildRoutes(route);
      });
    },
    async getRoutes() {
      let evaluatedRoute = null;
      try {
        router.beforeEach((to, from, next) => {
          // hack to allow for forward slashes in path ids
          //not sure how the double slash get's added in the first place
          if (to.fullPath.includes('//')) {
            next(to.fullPath.replace('//', '/'));
          }
          next();
        });

        let duoRoute =   {
          "id": 999,
          "title": "Duo",
          "route": "/duo",
          "name": "duo",
          "component": "duo/duo.vue",
          "order": 0,
          "alias": "/duo",
          "enabled": true,
          "parentMenuRouteId": 1,
          "nestedRouting": true     
   
    
        }
        this.createAndAppendRoute( duoRoute, this.loadView(duoRoute) )
        let service = injector.get("RouteSourcesService");
        
        let routeSources = await service.getRouteMenu();

        routeSources.forEach(route => {
          evaluatedRoute = route;
          this.createAndAppendRoute(route, this.loadView(route));
          this.appendChildRoutes(route);
        });



      } catch (err) {
        console.log(`Evaluated Route: ${evaluatedRoute}`)
        console.log(err);
      }
    },
    loadView(view) {
      return () => import("./views/" + view.component);
    },
    createAndAppendRoute(route, view) {

      let newRoute = {
        path: route.route === "/" ? "" : `/${route.route}`,
        component: view,
        name: `${route.name}`,
        alias: route.alias ? route.alias : undefined,
        meta: {
          routeDefinition: route
        },
        props: {
          entity_type_id: route.id
        }
      };

      let link = router.resolve({
        name: newRoute.name
      });

      if (!link.resolved.matched.length) {
        router.addRoutes([newRoute]);
      }


    }
  },
  watch: {
    async $route(to) {
      const configReaderService = injector.get("ConfigReaderService");
       if(this.duoEnabled === null){
         this.duoEnabled = await configReaderService.getConfigurationSetting("duoEnabled");
       }
      
      if(this.duoEnabled && to.name !== 'duo' && to.meta && to.meta.routeDefinition){
        if(to.meta.routeDefinition.mfa){
          let localStorageService = injector.get("localStorageService");
          localStorageService.set("MFA_REQUEST", to.name);
          let duoAuthService = injector.get("DuoAuthService");
          if(duoAuthService.getDuoState() !== "STATE_AUTH_PASSED"){
            //save to to variable
            this.$router.push({name: 'duo'})
            return;
          }
        }
      }
      this.currentRoute = to.name;
    }
  },
  async created() {
    //var userService = injector.get("UserService");
    //await  userService.get()

    await this.getRoutes();
    this.currentRoute = router.currentRoute.name;
  },
  mounted() {

    this.$refs.toastr.defaultPosition = 'toast-bottom-right';
    this.$refs.toastr.defaultTimeout = 3000;
  },



  //render: h => h(App)

}).$mount("#app");