import {
  BaseValidateMixin
} from "../../../../components/mixins/index";



import {
  Component,
  Watch
} from "vue-property-decorator";
import ActiveDirectoryInfo from './active-directory-info/active-directory-info.vue';
import AuditInfo from "./audit-info/audit-info.vue";
import CampusDirectoryInfo from './campus-directory-info/campus-directory-info.vue';
import Office365Info from './office-365-info/office-365-info.vue';
@Component({
  name: 'account-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService', 'EventBus', 'ScreenReaderAnnouncerService'],
  components: {
    ActiveDirectoryInfo,
    AuditInfo,
    CampusDirectoryInfo,
    Office365Info
  }
})

export default class AccountInfo extends BaseValidateMixin {
  //getAdToolsAccountInfoLdapAuditInfo
  filter = "";
  officeLoading = false;
  ldapData = null;
  adData = null;
  campusDirectoryData = null;
  office365Data = null;
  dataRetrievalSuccess = false;
  async search() {
    let errors = this.validate(this.$refs.searchForm);
    if (errors.length) {
      this.toastService.error("Search criteria empty, search f    ailed");
      return false;
    }


    this.clearArrays();
    this.dataRetrievalSuccess = false;
    if (!this.filter.trim()) {
      this.toastService.error("Search term too vague, please specify user to search for");
      return;
    }
    this.spinnerService.show();
    try {
      let ldapTask = this.ExchangeToolsService.getAdToolsAccountInfoLdapAuditInfo(this.filter)
      let adTask = this.ExchangeToolsService.getAdToolsAccountInfoActiveDirectoryAuditInfo(this.filter)
      let campusDirTask = this.ExchangeToolsService.getCampusDirectoryAuditInfo(this.filter);
      //let office365Task = this.ExchangeToolsService.getOffice365AuditInfo(this.filter);

      //let responses = await Promise.all([ldapTask, adTask, campusDirTask, office365Task]);
      let responses = await Promise.all([ldapTask, adTask, campusDirTask]);
      let ldapData = responses[0];

      let adData = responses[1];

      let campusDirData = responses[2];

      //let office365Data = responses[3];


      //campusDirData.homeAddress = "111 Ginkgo Trail, $ Chapel Hill, NC  27516 $ USA";
      if (responses.filter(c => c.status === false).length == 4) {

        this.toastService.error(`Failed to retrieve audit information for user ${this.filter}`);
        return;
      }

      if (adData.userDetail) {
        if(!adData.userDetail.proxyAddresses){
          adData.userDetail.proxyAddresses = [];
        }
        if(adData.userDetail.proxyAddresses.length)
        {
          //added due to missing proxy addresses user jtalcorn
          let emailAddresses = adData.userDetail.proxyAddresses.filter(c => c.startsWith("smtp:")).map(c => c.substring(5));
          adData.userDetail.proxyAddresses = emailAddresses;
        }
      }

      this.ldapData = ldapData;
      this.adData = adData;
      this.campusDirectoryData = campusDirData;
      //this.office365Data = office365Data;
      this.dataRetrievalSuccess = true;
      this.officeLoading = true;
      this.ExchangeToolsService.getOffice365AuditInfo(this.filter).then(response=>{
        this.office365Data = response;
      }).finally(()=>{
        this.officeLoading = false;
      });

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user");
    } finally {
      this.spinnerService.hide();
      this.EventBus.emit("attach-scroll")
    }



  }
  clearArrays() {
    this.ldapData = null;
    this.adData = null;
    this.campusDirectoryData = null;
    this.office365Data = null;
  }
  clear() {
    this.filter = "";
    this.dataRetrievalSuccess = false;
    this.clearArrays();

  }

  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Account Info");
  }

}