import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
import ActiveDirectoryInfo from './active-directory-info/active-directory-info.vue';
import AuditInfo from "./audit-info/audit-info.vue";
import CampusDirectoryInfo from './campus-directory-info/campus-directory-info.vue';

@Component({
  name: 'account-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService'],
  components: {
    ActiveDirectoryInfo,
    AuditInfo,
    CampusDirectoryInfo
  }
})

export default class AccountInfo extends Vue {
  //getAdToolsAccountInfoLdapAuditInfo
  filter = "";
  ldapData = null;
  adData = null;
  campusDirectoryData = null;

  async search() {
    if (!this.filter.trim()) {
      this.toastService.error("Search term too vague, please specify user to search for");
      return;
    }
    this.spinnerService.show();
    try {
      let ldapTask = this.ExchangeToolsService.getAdToolsAccountInfoLdapAuditInfo(this.filter)
      let adTask = this.ExchangeToolsService.getAdToolsAccountInfoActiveDirectoryAuditInfo(this.filter)
      let campudDirTask = this.ExchangeToolsService.getCampusDirectoryAuditInfo(this.filter);


      let responses = await Promise.all([ldapTask, adTask,campudDirTask]);

      this.ldapData = responses[0];

      let adData = responses[1];

      let campusDirData = responses[2];
      campusDirData.homeAddress = "111 Ginkgo Trail, $ Chapel Hill, NC  27516 $ USA";

      //adData.userDetail.lockoutTime = 132022454621120140;
      if (adData.userDetail) {
        let emailAddresses = adData.userDetail.proxyAddresses.filter(c => c.startsWith("smtp:")).map(c => c.substring(5));
        adData.userDetail.proxyAddresses = emailAddresses;
      }

      
      this.adData = adData;
      this.campusDirectoryData = campusDirData;

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
    this.campusDirectoryData = null;

  }

  async mounted() {
    this.toastService.set(this);
  }

}