import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'list-manager',
  dependencies: ['$', 'moment','spinnerService','toastService', 'localStorageService', 'ConfigReaderService', 'ListManagerService']

})
export default class ListManager extends Vue {
  basePath = "";
  listName = "";
  closeDialog() {
    this.$refs.confirmMigration.hide();

  }
  async mounted() {
    this.toastService.set(this);
    const listmanagerSettings = await this.ConfigReaderService.getConfigurationSetting(
      "listmanager"
    );
    this.basePath = listmanagerSettings.lyris_list_base_path;


    if (!this.localStorageService.sessionGet('list-manager:showMessage')) {
      this.$refs.confirmMigration.show();
      this.localStorageService.sessionSet('list-manager:showMessage', true);
    }


  }
  async navigateToList(listName) {
    try {
      
      this.spinnerService.show();
      let response = await this.ListManagerService.getListsByName(listName)
      
      if(response.length == 0){
        this.toastService.error("Could not locate Lyris List with given name");
        return;
      }
      
      window.open(this.basePath + 'read/?forum=' + listName, "_blank");    

    } catch (e) {
      window.console.log(e);
      this.toastService.error('');
    } finally {
      this.spinnerService.hide();
    }
  }
  async manageList(listName) {
    try {
      this.spinnerService.show();
      let response = await this.ListManagerService.getListsByName(listName)
      if(response.length == 0){
        this.toastService.error("Could not locate Lyris List with given name");
        return;
      }
      
      window.open(this.basePath + 'read/?current_list=' + listName, "_blank");    

    } catch (e) {
      window.console.log(e);
      this.toastService.error('');
    } finally {
      this.spinnerService.hide();
    }
  }
  visit() {
    //https://lists.unc.edu/read/?forum=test1
  }
  manage() {

  }

}