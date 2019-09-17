import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";


@Component({
  name: 'route-management',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'AdministrationService', 'RouteSourcesService', 'EventBus'],
  components: {}

})

export default class RouteManagement extends Vue {
  name = 'route-management';
  
  newRoute = {
    children: [],
    isNew: true
  };
  
  model = {
    includeChildren: true,
    includeParents: true,
  };
  
  entities = [];

  async mounted() {
    this.toastService.set(this);
    await this.bindList();
  }

  async bindList() {
    try {
      this.spinnerService.show();

      let data = await this.AdministrationService.getRoutes();
      data[0].expanded = false;

      this.entities = JSON.parse(JSON.stringify(data));
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve routes");
    } finally {
      this.spinnerService.hide();
    }

  }

  toggleShowChildren(entity) {
    entity.expanded = !entity.expanded;


    const $ = this.$;

    function showScroll() {
      setTimeout(() => {
        $(".sdd-grid").each(item => {
          new SimpleBar($(".sdd-grid")[item], {
            autoHide: false,
            classNames: {
              scrollbar: "sb-scrollbar"
            }
          });
        });
      }, 500);
    }


    if (entity.expanded) {
      showScroll();
      this.EventBus.emit("attach-scroll");

    }


    this.entities = JSON.parse(JSON.stringify(this.entities));

  }


  async clear() {
    this.model = {
      includeChildren: true,
      includeParents: true
    }
    await this.bindList();
  }

  _getParentRoutes(routes, targetRouteId) {
    let response = [];
    let targetRoute = [];
    let isNumber = false;


    if (!!targetRouteId) {
      targetRoute = routes.filter(c => c.id == targetRouteId);
    } else {
      isNumber = (!!this.model.filter && this.model.filter.match(/[0-9]+/g));
      if (isNumber) {
        targetRoute = routes.filter(c => c.id == this.model.filter);
      } else if (!!this.model.filter) {
        targetRoute = routes.filter(c => c.name.toLowerCase().includes(this.model.filter.toLowerCase()));
      } else {
        targetRoute = [];
      }

    }


    if (!targetRoute.length) {
      return response;
    }
    response.push(targetRoute[0]);
    if (targetRoute[0].parentRouteId && this.model.includeParents) {
      let parentRoutes = this._getParentRoutes(routes, targetRoute[0].parentRouteId)
      for (let i = 0; i < parentRoutes.length; i++) {
        response.push(parentRoutes[i])
      }
    }
    return response;
  }

  async _searchSingleEntity() {
    let allRoutes = await this.RouteSourcesService.getAllMenuItems();
    if(allRoutes == null) return null;
    allRoutes = JSON.parse(JSON.stringify(allRoutes));
    let routeList = this._getParentRoutes(allRoutes);

    routeList = routeList.reverse();


    let response = [];

    for (let i = 0; i < routeList.length; i++) {

      let target = routeList[i];
      if ((i + 1) == routeList.length && !this.model.includeChildren) {
        target.children = [];
      } else if ((i + 1) < routeList.length) {
        target.children = [routeList[i + 1]];
      }


      response.push(target);
    }
    response = [response[0]];

    response = JSON.parse(JSON.stringify(response));

    this.entities = response;
  }

  async search() {
    if (!!this.model.filter) {
      await this._searchSingleEntity();

    }

  }

  _refreshRoute(id, entities, targetRoute) {
    let index = entities.findIndex(c => c.id === id);

    if (index > -1) {
      entities[index] = targetRoute;
    } else {
      for (let i = 0; i < entities.length; i++) {
        if (entities[i].children) {
          this._refreshRoute(id, entities[i].children, targetRoute)
        }
      }
    }

  }


  async onRouteUpdated(route) {

    this._refreshRoute(route.id, this.entities, route);

    this.entities = JSON.parse(JSON.stringify(this.entities));
  }

  async onRouteDeleted() {
    await this.clear();
  }

  async onConfirmAddRouteClick() {
    try {
      this.spinnerService.show();
      await this.RouteSourcesService.addNewRoute(this.newRoute);

      this.toastService.success("Successfully created new route");
      
      await this.clear();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add new route");
    } finally {
      this.spinnerService.hide();
      this.$refs.confirmAddRoute.hide();
    }


  }

  onCancelAddRouteClick() {
    this.$refs.confirmAddRoute.hide();
  }
}