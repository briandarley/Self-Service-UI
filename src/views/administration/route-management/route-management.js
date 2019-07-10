import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";


@Component({
    name: 'route-management',
    dependencies: ['$','moment','toastService','spinnerService','AdministrationService','RouteSourcesService','EventBus'],
    components:{}
    
  })

export default class RouteManagement extends Vue {
  name =  'route-management';
  model = {};
  entities = [];
  async mounted() { 
    this.toastService.set(this);
     let data = await this.AdministrationService.getRoutes();
     data[0].expanded = false;

     this.entities = data;
  }

  toggleShowChildren(entity){
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
  
  clear(){

  }

  _getParentRoutes(routes, targetRouteId){
    let response = [];
    let targetRoute = [];
    let isNumber = false;

    
    if(!!targetRouteId){
      targetRoute = routes.filter(c=> c.id == targetRouteId);
    }
    else{
      isNumber = this.model.filter.match(/[0-9]+/g);
      if(isNumber)
      {
        targetRoute = routes.filter(c=> c.id == this.model.filter);  
      } else {
        targetRoute = routes.filter(c=> c.name.toLowerCase().includes(this.model.filter.toLowerCase()));  
      }
      
    }
        
    
    if(!targetRoute.length){
      return response;
    }
    response.push(targetRoute[0]);
    if( targetRoute[0].parentRouteId){
      let parentRoutes = this._getParentRoutes(routes,  targetRoute[0].parentRouteId)
      for(let i = 0; i < parentRoutes.length; i++){
        response.push(parentRoutes[i])
      }
    }
    return response;
  }
  async _searchSingleEntity(){
    let allRoutes = await this.RouteSourcesService.getAllMenuItems();
    
    let routeList = this._getParentRoutes(allRoutes);
    
    routeList = routeList.reverse();
    
    
    let response = [];
    
    for(let i = 0; i < routeList.length; i++){
      
      let target = routeList[i];

      if((i+1) < routeList.length )
      {
        target.children = [routeList[i+1]]
      }
      
      response.push(target);
    }
    
    this.entities = [response[0]];
  }

  async search(){
    
    if(!!this.model.filter){
      await this._searchSingleEntity();      

    }
    
  }



}

