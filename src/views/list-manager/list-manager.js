import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'list-manager',
    dependencies: ['$','moment','localStorageService'],
    components:{}
    
  })
export default class ListManager extends Vue {
  
  closeDialog(){
    this.$refs.confirmMigration.hide();
  
  }
  async mounted() { 
    if(!this.localStorageService.sessionGet('list-manager:showMessage'))
    {
      this.$refs.confirmMigration.show();
      this.localStorageService.sessionSet('list-manager:showMessage', true);
    }
    
    
  }
  
}

