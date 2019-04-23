import Vue from "vue"
import { Component } from "vue-property-decorator";
import MfaModifyAccount from "./mfa-modify-account.vue";
import MfaDisabledAccounts from "./mfa-disabled-accounts.vue";
@Component({
    name: 'mfa-manage',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{MfaModifyAccount,MfaDisabledAccounts}
  })

export default class MfaManage extends Vue {


  async mounted() { 
    this.toastService.set(this);
  }
  
}

