import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'search-lists',
  dependencies: ['$','toastService', 'spinnerService', 'ConfigReaderService', 'ListManagerService', 'ScreenReaderAnnouncerService']
})
export default class SearchLists extends BaseValidateMixin {
  nameLike = "";
  data = [];
  basePath = "";
  lyrisListChanged(val) {
    this.data = val;
  }
  clear() {
    this.nameLike = "";
    this.data = [];
  }
  async search() {
    
    let errors = this.validate(this.$refs.searchForm);
    if (errors.length) {
      this.toastService.error(`Validation Failed, ${errors.join(',')} `);
      return false;
    }

    this.spinnerService.show();
    try {
      this.data = await this.ListManagerService.queryListsByName(this.nameLike);

    } catch (e) {
      console.log(e);
      this.toastService.error('Failed to retrieve records');
    }
    this.spinnerService.hide();
  }
  async mounted() {
    const listmanagerSettings = await this.ConfigReaderService.getConfigurationSetting(
      "listmanager"
    );
    this.basePath = listmanagerSettings.lyris_list_base_path;
    this.toastService.set(this);

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Search Lyris Lists");
  }

}