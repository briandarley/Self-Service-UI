import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";


@Component({
  name: 'child-route-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService','EventBus'],
  components: {
    
  },
  props: ['model']

})
export default class ChildRouteInfo extends Vue {
  name = 'child-route-info';
  entities = [];

  
  async mounted() {
    this.toastService.set(this);
    this.entities = this.model;
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
    }


    this.entities = JSON.parse(JSON.stringify(this.entities));
    this.EventBus.emit("attach-scroll");
  }

  async onRouteUpdated(route){
    this.$emit('routeUpdated', route)
  }

  async onRouteDeleted(){
    this.$emit('routeDeleted')
  }
  
}