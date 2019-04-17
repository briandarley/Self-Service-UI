import injector from "vue-inject";
//import json from "../../../static/mock/mock-menu.json";

/* eslint-disable */

//http://its-idmtst-app.adtest.unc.edu/Services/business.selfservice.api/v1/Routes
function RouteSourcesService(httpHandlerService) {
  return {
    routeMenu: null,
    _routeData: null,
    async getAllMenuItems(criteria) {

      if (!this._routeData) {
        const handler = await httpHandlerService.get(10000);

        let routeData = await handler.get('routes');

        this._routeData = routeData.data.map(c => {
          c.parentRouteId = c.parentMenuRouteId;
          c.order = c.order;
          if(c.alias){
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
        if(criteria.excludeUnOrdered){
          data = data.filter(c => c.order &&  c.order >= 0);
        }
      }

      return data;
    },
    async getFlattenedMenu(criteria) {

      let result = await this.getRouteMenu(criteria);

      if (result && result.length === 1) {
        result = result.concat(result[0].children);
      }

      let reduced = result.reduce((a, b) => {

        if (a.children) {
          let list = a.children.concat(b.children);
          //list.concat([b]);
          return list;
        } else {
          let list = a.concat(b.children);
          //list.concat([b]);
          return list;
        }

        //return a.concat(b.children);
      });

      result = result.concat(reduced);
      return result;


    },
    async getRouteMenu(criteria) {
      //Called from Main
      let data = await this.getAllMenuItems(criteria);
      return data;

    }
  };
}

injector.service("RouteSourcesService", ['httpHandlerService'], RouteSourcesService);