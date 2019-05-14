import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
import ActiveDirectoryInfo from './active-directory-info/active-directory-info.vue';
import AuditInfo from "./audit-info/audit-info.vue";

@Component({
  name: 'account-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
  components: {
    ActiveDirectoryInfo,
    AuditInfo
  }
})

export default class AccountInfo extends Vue {
  //getAdToolsAccountInfoLdapAuditInfo
  filter = "";
  ldapData = null;
  adData = null;

  async search() {
    if (!this.filter.trim()) {
      this.toastService.error("Search term too vague, please specify user to search for");
      return;
    }
    this.spinnerService.show();
    try {
      let ldapTask = this.ExchangeToolsService.getAdToolsAccountInfoLdapAuditInfo(this.filter)
      let adTask = this.ExchangeToolsService.getAdToolsAccountInfoActiveDirectoryAuditInfo(this.filter)

      let responses = await Promise.all([ldapTask, adTask]);

      this.ldapData = responses[0];

      let adData = responses[1];
      //adData.userDetail.lockoutTime = 132022454621120140;
      if (adData.userDetail) {
        let emailAddresses = adData.userDetail.proxyAddresses.filter(c => c.startsWith("smtp:")).map(c => c.substring(5));
        adData.userDetail.proxyAddresses = emailAddresses;
      }

      //window.console.log(adData.userDetail.proxyAddresses);
      this.adData = adData;


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user");
    } finally {
      this.spinnerService.hide();
    }



  }

  clear() {
    this.filter = "";
    this.ldapData = null;
    this.adData = null;

  }

  async mounted() {
    this.toastService.set(this);
  }

}