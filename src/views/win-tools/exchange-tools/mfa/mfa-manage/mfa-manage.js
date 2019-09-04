import Vue from "vue"
import { Component } from "vue-property-decorator";
import MfaModifyAccount from "./mfa-modify-account.vue";
import MfaDisabledAccounts from "./mfa-disabled-accounts.vue";
@Component({
    name: 'mfa-manage',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    components:{MfaModifyAccount,MfaDisabledAccounts}
  })

export default class MfaManage extends Vue {

  tabChanged(tab){
    
    if(tab.index == 1){
      this.$refs.mfaDisabledAccounts.loadGrid();
    }
  }
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - MFA Management");
  }
  
}

