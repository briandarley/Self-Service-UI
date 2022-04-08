import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "contacts",
  dependencies: [
    "$",
    "moment",
    "CommonExtensions",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "ScreenReaderAnnouncerService",
  ],
})
export default class Contacts extends Vue {
  entity = {
    valid: false,
  };
  selectedSmtpAddress = "";
  newProxyAddress = "";
  filter = "";

  async mounted() {
    this.toastService.set(this);
  }
  

  clear() {
    this.entity = { valid: false };
    this.filter = "";
  }

  async addSmtpAddress() {
    try {
      this.spinnerService.show();

      if (!this.newProxyAddress.match(/^[a-zA-Z0-9]+:/)) {
        this.newProxyAddress = "smtp:" + this.newProxyAddress;
      }
      if(this.entity.proxyAddresses.some(c=> c== this.newProxyAddress)){
        this.toastService.error("Duplicate entry found");
        return;
      }

      this.entity.proxyAddresses.push(this.newProxyAddress);
      
      let response = await this.ExchangeToolsService.updateContact(this.entity.distinguishedName, { proxyAddresses: this.entity.proxyAddresses});
      
      if(response.status !== false) {
        this.toastService.success("Successfully added smtpAddress")
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to update contact object");
    } finally {
      this.spinnerService.hide();
    }
  }

  async removeSmtpAddress() {
    try {
      this.spinnerService.show();
      let index = this.entity.proxyAddresses.indexOf(this.selectedSmtpAddress);

      let proxyAddresses = this.entity.proxyAddresses;
      
      proxyAddresses.splice(index, 1);
     

      let response = await this.ExchangeToolsService.updateContact(this.entity.distinguishedName, { proxyAddresses: proxyAddresses});

      if(response.status !== false) {
        this.toastService.success("Successfully removed smtpAddress")

        this.entity.proxyAddresses = proxyAddresses;

        if (this.entity.proxyAddresses.length) {
          this.selectedSmtpAddress = this.entity.proxyAddresses[0];
        }


      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to update contact object");
    } finally {
      this.spinnerService.hide();
    }
  }
  async search() {
    try {
      this.spinnerService.show();

      let response = await this.ExchangeToolsService.getContact(this.filter);
      if (response.status === false) {
        this.toastService.error("Failed to locate contact given criteria");
        this.entity = {};
      } else {
        this.entity = response;
        this.selectedSmtpAddress = this.entity.proxyAddresses[0];
      }

      //this.pagedResponse = pagedResponse;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve members entities");
    } finally {
      this.spinnerService.hide();
    }
  }
}
