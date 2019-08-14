import Vue from "vue";
import App from "./App.vue";
import injector from "vue-inject";
import "./app_root_dependencies";
import router from "./router";
import {
  VueRouter
} from "./components/index.js";

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
      duoEnabled: null,
      routeSources: []
    };
  },

  methods: {

    
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

        let duoRoute = {
          "id": 999,
          "title": "Duo",
          "route": "/duo",
          "name": "duo",
          "component": "duo/duo.vue",
          "order": 0,
          "alias": "/duo",
          "enabled": true,
          "parentMenuRouteId": 1,
          "nestedRouting": false


        }
        await this.createAndAppendRoute(duoRoute, this.loadView(duoRoute));


        this.routeSources.forEach(async route => {
          evaluatedRoute = route;
          await this.createAndAppendRoute(route, this.loadView(route));
          
        });
        


      } catch (err) {
        window.console.log(`Evaluated Route: ${evaluatedRoute}`)
        window.console.log(err);
      }
    },
    loadView(view) {
      return () => import("./views/" + view.component);
    },
    
    async getNestedChildRoutes(route) {
      let children = this.routeSources.filter(c => c.parentRouteId === route.id && c.nestedRouting);
      
      for (let i = 0; i < children.length; i++) {
        let childComponent = await import("./views/" + children[i].component);
        children[i].component = childComponent.default;
        children[i].path = children[i].route;
      }
      let response = children.map(c => {
        return {
          component: c.component,
          path: c.path,
          name: c.name
        }
      });
      if (response.length) {
        response.push({
          
          path: route.route,
          name: route.name 
        })
        response.reverse()
      }

      router.addRoutes(response)

      return response;
    },
    async createAndAppendRoute(route, view) {
      //mass-mail/create-request/steps/basic-information/basic-information.vue
      if(route.nestedRouting)
      {
        return;
      }
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

       let childRoutes = await this.getNestedChildRoutes(route);

       newRoute.children = childRoutes;


       if (newRoute.children.length) {
         newRoute.name = "";
        
       }



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
      if (this.duoEnabled === null) {
        this.duoEnabled = await configReaderService.getConfigurationSetting("duoEnabled");
      }
      
      if (this.duoEnabled && to.name !== 'duo' && to.meta && to.meta.routeDefinition) {
        if (to.meta.routeDefinition.mfa) {
          let localStorageService = injector.get("localStorageService");
          localStorageService.set("MFA_REQUEST", to.name);
          let duoAuthService = injector.get("DuoAuthService");
          if (duoAuthService.getDuoState() !== "STATE_AUTH_PASSED") {
            //save to to variable
            this.$router.push({
              name: 'duo'
            })
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
    let referer = window.document.referrer;
    //https://sso-test.isis.unc.edu/idp/profile/SAML2/Redirect/SSO?execution=e1s1
    //  if(referer.indexOf("SAML2") > -1){
       
    //  }
    window.addEventListener('beforeunload', async function(event) {
      let userService = injector.get("UserService");
      await userService.logout();
      return true;
    });
    window.addEventListener('unload', async function(event) {
      let userService = injector.get("UserService");
      await userService.logout();
      return true;
    });

    

    
    let service = injector.get("RouteSourcesService");
    this.routeSources = await service.getRouteMenu();

    await this.getRoutes();
    this.currentRoute = router.currentRoute.name;
  },
  mounted() {
    this.$refs.toastr.defaultPosition = 'toast-bottom-right';
    this.$refs.toastr.defaultTimeout = 3000;
  }



  //render: h => h(App)

}).$mount("#app");