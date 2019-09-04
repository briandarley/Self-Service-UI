import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'search-lists',
  dependencies: ['toastService', 'spinnerService', 'ConfigReaderService','ListManagerService','ScreenReaderAnnouncerService']
})
export default class SearchLists extends Vue {
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