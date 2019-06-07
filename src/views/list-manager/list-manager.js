import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'list-manager',
    dependencies: ['$','moment','localStorageService','ConfigReaderService']
   
  })
export default class ListManager extends Vue {
  basePath = "";
  listName = "";
  closeDialog(){
    this.$refs.confirmMigration.hide();
  
  }
  async mounted() { 
    const listmanagerSettings = await this.ConfigReaderService.getConfigurationSetting(
      "listmanager"
    );
    this.basePath = listmanagerSettings.lyris_list_base_path;


    if(!this.localStorageService.sessionGet('list-manager:showMessage'))
    {
      this.$refs.confirmMigration.show();
      this.localStorageService.sessionSet('list-manager:showMessage', true);  
    }
    
    
  }

  visit(){
//https://lists.unc.edu/read/?forum=test1
  }
  manage(){

  }
  
}

