import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'compromised-accounts',
  dependencies: [
    "$",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "CommonExtensions",
    "ScreenReaderAnnouncerService"
  ]

})

export default class CompromisedAccounts extends BaseValidateMixin {
  filter = "";
  compromisedAccounts = []
  async clear() {
    this.filter = "";
    this.compromisedAccounts = [];
    this.clearValidation();
    await this.search(true);
  }

  async search(skipvalidation) {
    if (!skipvalidation) {
      let errors = this.validate(this.$refs.submitForm);
      if (errors.length) {
        this.toastService.error("Validation Failed");
        return false;
      }
    }

    this.spinnerService.show();
    try {
      this.compromisedAccounts = await this.ExchangeToolsService.getCompromisedAccounts(this.filter);

      if (this.compromisedAccounts.status === false) {
        this.compromisedAccounts = [];
        this.toastService.error("Account not found");

      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve compromised accounts");
    } finally {
      this.spinnerService.hide();
    }
  }
  async mounted() {
    this.toastService.set(this);
    await this.search(true);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - Compromised Accounts");

  }

}