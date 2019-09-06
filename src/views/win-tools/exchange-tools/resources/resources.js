import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

import { Component } from "vue-property-decorator";

@Component({
  name: "resources",
  dependencies: [
    "$",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "CommonExtensions",
    "ScreenReaderAnnouncerService"
  ]
})
export default class Resources extends BaseValidateMixin {
  filter = "";
  resources = [];
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - Resources");
  }

  async search() {
    let errors = this.validate(this.$refs.submitForm);
    if (errors.length) {
      this.toastService.error("Validation Failed");
      return false;
    }
    
    this.spinnerService.show();
    try {
      this.resources = [];
      let resources = await this.ExchangeToolsService.getResources(this.filter);

      if (resources && resources.status === false) {
        this.toastService.warn("No resources associated with this account");
        return;
      }

      this.resources = resources.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } catch (e) {
      window.console.log(e);
      this.toastService.error(
        "Failed to retrieve resources associated with user"
      );
    } finally {
      this.spinnerService.hide();
    }
  }
  async clear() {
    this.filter = "";
    this.resources = [];
  }
}