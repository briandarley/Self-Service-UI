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
        if (!this._routeData) {
          const handler = await httpHandlerService.get(10000);

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

      let result = await this.getRouteMenu({});
      //get first record where parentMenuRouteId is null (this is the parent of all)
      let homeRoute = result.filter(c => c.parentRouteId == null)[0];

      homeRoute.children = this._getChildRoutes(result, homeRoute.id);
      return [homeRoute];




    },
    async getRouteMenu(criteria) {
      //Called from Main
      let data = await this.getAllMenuItems(criteria);
      return data;

    }
  };
}

injector.service("RouteSourcesService", ['httpHandlerService'], RouteSourcesService);