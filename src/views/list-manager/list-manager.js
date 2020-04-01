import {BaseValidateMixin} from "../../components/mixins/index";


import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'list-manager',
  dependencies: ['$', 'moment','spinnerService','toastService', 'localStorageService', 'ConfigReaderService', 'ListManagerService','ScreenReaderAnnouncerService']

})
export default class ListManager extends BaseValidateMixin {
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

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Lyris List Manager");

  }
  async navigateToList(listName) {
    try {
      let errors = this.validate(this.$refs.searchForm);
      if (errors.length) {
        this.toastService.error("Validation Failed");
        return false;
      }

      
      
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
      //https://lists.unc.edu/?current_list=sotlines
      window.open(this.basePath + '/?current_list=' + listName, "_blank");    

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