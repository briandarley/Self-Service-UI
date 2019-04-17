import Vue from "vue"
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
    "CommonExtensions"
  ]

})

export default class CompromisedAccounts extends Vue {
  filter = "";
  compromisedAccounts = []
  clear() {
    this.filter = "";
    this.compromisedAccounts = [];
  }

  async search() {
    this.spinnerService.show();
    try{
      this.compromisedAccounts = await this.ExchangeToolsService.getCompromisedAccounts(this.filter);
      
      if(this.compromisedAccounts.status === false){
        this.compromisedAccounts = [];
        this.toastService.error("Account not found");
        
      }
    }
    catch(e){
      window.console.log(e);
      this.toastService.error("Failed to retrieve compromised accounts");
    }
    finally{
      this.spinnerService.hide();
    }
  }
  async mounted() {
    this.toastService.set(this);
    await this.search();
  }

}