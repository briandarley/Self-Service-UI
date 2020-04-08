import Vue from "vue"
import {
  Component
  
} from "vue-property-decorator";
import Spinner from "@/components/spinner/spinner.vue";



@Component({
  name: 'active-directory-info',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'CommonExtensions','ScreenReaderAnnouncerService'],
  props: ['data'],
  components: {Spinner}
})

export default class ActiveDirectoryInfo extends Vue {

  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Active Directory");
  }

  isEmpty(value) {
    const moment = this.moment;

    if (this.CommonExtensions.isDate(value)) {
      if (moment(value).year() < 1900) {
        return true;
      }
      return false;
    }

   return false;
  }
  showSpinner(){
    this.$refs.spinnerCntrl.showSpinner();
  }
  hideSpinner(){
    this.$refs.spinnerCntrl.hideSpinner();
  }

  async enableAccount(){
    
    try {
      this.showSpinner()
            
      await this.ExchangeToolsService.unlockAdUser(this.data.userDetail.samAccountName);
      
      this.data.userDetail.lockoutTime = 0;
      this.toastService.success("Successfully unlocked account");
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to unlock account");
    }
    finally {
      this.hideSpinner();
    }
    
  }
}