import injector from "vue-inject";
//import json from "../../../static/mock/mock-menu.json";

/* eslint-disable */

//http://its-idmtst-app.adtest.unc.edu/Services/business.selfservice.api/v1/Routes
function RouteSourcesService(httpHandlerService) {
  return {
    routeMenu: null,
    _routeData: null,
    async getAllMenuItems(criteria) {
      try {
        if(criteria && (criteria.cached !== undefined || criteria.cached === false))
        {
          this._routeData = null;
        }
        if (!this._routeData) {

          let handler = await httpHandlerService.get(10000);
          
          let routeData = await handler.get('routes');

          this._routeData = routeData.data.map(c => {
            c.parentRouteId = c.parentMenuRouteId;
            c.order = c.order;
            if (c.alias) {
              c.alias = c.alias.split(",")
            }


            if (!c.order) {
              c.order = 0;
            }

            if (c.roles) {
              c.roles = c.roles.split(",").map(c => c.trim());
            }
            delete c.parentMenuRouteId;
            return c;

          });

          this._routeData.sort((a, b) => {
            if (a.order === -1)
              return 1;
            if (a.order < b.order) {
              return -1;
            }
            if (a.order > b.order) {
              return 1;
            }
            return 0;
          })

        }

        let data = this._routeData;

        if (criteria) {
          if (criteria.exlcudeWildCard) {
            data = data.filter(c => c.route !== "*");
          }
          if (criteria.excludeUnOrdered) {
            data = data.filter(c => c.order && c.order >= 0);
          }
        }

        return data;
      } catch (e) {

        window.console.log(e);
        throw e;
      }

    },

    _getChildRoutes(routes, parentRouteId) {
      let children = routes.filter(c => c.parentRouteId === parentRouteId).sort((a, b) => {
        if (a.order < b.order) return -1;
        if (a.order > b.order) return 1;
        return 0;
      });

      for (let i = 0; i < children.length; i++) {
        children[i].children = this._getChildRoutes(routes, children[i].id);
      }
      return children;
    },

    async getFlattenedMenu() {

      let result = await this.getRouteMenu({cached:false});
      //get first record where parentMenuRouteId is null (this is the parent of all)
      let homeRoute = result.filter(c => c.parentRouteId == null)[0];

      homeRoute.children = this._getChildRoutes(result, homeRoute.id);
      return [homeRoute];




    },
    async getRouteMenu(criteria) {
      //Called from Main
      let data = await this.getAllMenuItems(criteria);
      return data;

    },
    async updateRoute(route) {
      try {

        const handler = await httpHandlerService.get();
        let model = JSON.parse(JSON.stringify(route));
        model.parentMenuRouteId = model.parentRouteId;
        
        if(Array.isArray(route.roles)) 
        {
          model.roles = route.roles.join(",");
        }
        
        let response = await handler.put(`/routes/${model.id}`, model);

        return response.data;

      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false
          };
        }
        throw e;
      }
    },
    async addNewRoute(route) {
      try {
        const handler = await httpHandlerService.get();
        let model = JSON.parse(JSON.stringify(route));

        model.parentMenuRouteId = model.parentRouteId;
        
        if(Array.isArray(route.roles)) 
        {
          model.roles = route.roles.join(",");
        }
        delete model.id;

        let response = await handler.post(`/routes`, model);

        return response.data;

      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false
          };
        }
        throw e;
      }
    },
    async deleteRoute(routeId) {
      try {
        const handler = await httpHandlerService.get();
        
        await handler.delete(`/routes/${routeId}`);
        

      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false
          };
        }
        throw e;
      }
    }
  
  };
}

injector.service("RouteSourcesService", ['httpHandlerService'], RouteSourcesService);