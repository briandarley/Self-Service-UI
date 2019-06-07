/* eslint-disable */
import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";
import SimpleBar from 'simplebar';

@Component({
  name: "side-menu",
  dependencies: ["$", "RouteSourcesService"]

})
export default class SideMenu extends Vue {
  routes = [];
  currentRoute = null;

  tree = [];

  async _getRouteInfo() {
    if (!this.currentRoute.meta.routeDefinition) return null;


    let routeDetail = this.currentRoute.meta.routeDefinition;
    if (!routeDetail) return null;


    let criteria = {
      excludeWildCards: true,
      excludeUnOrdered: true
    }

    let menuResult = await this.RouteSourcesService.getRouteMenu(criteria);
    if (routeDetail.order === -1) {
      routeDetail = menuResult.find(c => c.id === routeDetail.parentRouteId);
    }
    if (routeDetail.route === "*") {
      //revert to home
      let routeTree = menuResult;
      routeDetail = routeTree[0];
    }

    return {routeDetail: routeDetail,menuResult : menuResult }

  }

  _getChildRoutes(routeDetail,menuResult){

    let childRoutes = [];

     //Is the selected route a parent route?
    //select the selected route + children
    //else
    //find parent of selected route
    //&& !c.nestedRouting
    let availableRoutes = menuResult.filter(
      c => c.parentRouteId === routeDetail.id && !c.nestedRouting
    );

    if (availableRoutes.length) {
      routeDetail.children = []; //zero out the children of parent to prevent nesting
      childRoutes = [routeDetail];
      //find the children of the available routes, this will allow users to navigate through the list
      for (var i = 0; i < availableRoutes.length; i++) {
        let childRoute = availableRoutes[i];
        //&& !c.nestedRouting
        childRoute.children = menuResult.filter(
          c => c.parentRouteId === childRoute.id && !c.nestedRouting
        );
      }
      childRoutes = childRoutes.concat(availableRoutes);
    } else {

      let parentRoute = menuResult.find(
        c => c.id === routeDetail.parentRouteId
      );

      if (parentRoute) {
        parentRoute.children = []; //zero out the children of parent to prevent nesting
        childRoutes = [parentRoute];
      }
      availableRoutes = menuResult.filter(
        c => c.parentRouteId === routeDetail.parentRouteId && !c.nestedRouting
      );
      //find the children of the available routes, this will allow users to navigate through the list
      for (var i = 0; i < availableRoutes.length; i++) {
        let childRoute = availableRoutes[i];

        childRoute.children = menuResult.filter(
          c => c.parentRouteId === childRoute.id && !c.nestedRouting
        );
      }
      childRoutes = childRoutes.concat(availableRoutes);
    }

    return childRoutes;
  }

  _cleanAndSortRoutes(routes){
    routes.sort((a, b) => {
      return a.order > b.order
    })

    //if the route contains parameter options, don't add it
    routes = routes.map(c => {
      let route = c.route.replace(/\/:[a-zA-Z0-9]+\??$/, "");
      c.route = route;

      return c;
    })

    return routes;
  }

  @Watch("$route", {
    immediate: false
  })
  async onRouteChanged(newValue, oldValue) {
    if (newValue.name == oldValue.name) return;
    this.currentRoute = newValue;

    let routeInfo = await this._getRouteInfo();

    if(!routeInfo) return;
    
    let childRoutes = this._getChildRoutes(routeInfo.routeDetail, routeInfo.menuResult);
          
    childRoutes = this._cleanAndSortRoutes(childRoutes);
    
    this.populateMenu(childRoutes);
    this.buildOutCrumbs();

  }

  isMenuActive(menuItem) {
    if (!this.$route.meta.routeDefinition || this.$route.name === "404") {
      return menuItem.name === "home";
    }

    if (this.$route.meta.routeDefinition.order === -1) {
      return this.$route.meta.routeDefinition.parentRouteId === menuItem.id;
    }
    return this.$route.meta.routeDefinition.id === menuItem.id;
  }
  hasChildren(menuItem) {
    if (!this.$route.meta.routeDefinition) {
      if (menuItem.name === "home") return false;

      return menuItem.children && menuItem.children.length > 0;
    }

    if (this.$route.meta.routeDefinition.name === menuItem.name) {
      return false;
    }

    return menuItem.children && menuItem.children.length;
  }
  async mounted() {
    const $ = this.$;

    new SimpleBar($('.side-menu')[0], {
      autoHide: false,
      classNames: {
        scrollbar: 'sb-scrollbar',
      }
    });



  }


  populateMenu(menuItems) {
    if (!menuItems || menuItems.length === 0) return;
    
    this.routes = [];
    
    this.routes = menuItems;
    //this.routes.shift();
  }

  async buildOutCrumbs() {
    this.tree = [];

    let allRoutes = await this.RouteSourcesService.getAllMenuItems({
      exlcudeWildCard: true
    });

    let routeDefinition = this.$route.meta.routeDefinition;

    let parentRoute = allRoutes.find(
      c => c.id === routeDefinition.parentRouteId
    );
    //&& !c.nestedRouting
    if (
      parentRoute &&
      !allRoutes.some(c => c.parentRouteId === routeDefinition.id && !c.nestedRouting)
    ) {
      parentRoute = allRoutes.find(c => c.id === parentRoute.parentRouteId);
    }
    //if(!routeDefinition.children.length)

    let list = [];
    while (parentRoute) {
      //&&  !c.nestedRouting
      let children = allRoutes.filter(c => c.parentRouteId === parentRoute.id && !c.nestedRouting);

      if (
        children.length &&
        (!routeDefinition.children ||
          routeDefinition.children.length === 0 ||
          !children.some(c => c.id === routeDefinition.id))
      ) {
        list.push(parentRoute);
      }
      parentRoute = allRoutes.find(c => c.id === parentRoute.parentRouteId);
    }

    let tree = JSON.parse(JSON.stringify(list.reverse()));

    if (tree.length > 2) {
      tree[0].title = "...";
    }

    this.tree = tree;


  }
}