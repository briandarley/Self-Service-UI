import {
  BaseValidateMixin
} from "./../../../components/mixins/index";
import {
  Component
} from "vue-property-decorator";
import StepNavigation from './nav/step-navigation.vue';
import BasicInformation from './steps/basic-information/basic-information.vue';
import AudienceCriteria from './steps/audience-criteria/audience-criteria.vue';
@Component({
  name: 'create-request',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService'],
  components: {
    StepNavigation,
    BasicInformation,
    AudienceCriteria
  },
  props: ['id']
})

export default class CreateRequest extends BaseValidateMixin {
  loaded = true;
  currentView = "BASIC_INFORMATION";
  model = {
  
     sendFrom: "",
     expirationDate: null,
     sendDate: null,
     replyTo: "",
     subject: "",
     sponsoringUniversity: ""
  
  }
 
  //maxNavigation = "BASIC_INFORMATION";
  getCurrentNavIndex() {
    if (!this.$refs.stepNav) return 0;
    return this.$refs.stepNav.getCurrentNavIndex();
  }
  getPreviousNav() {
    if (!this.$refs.stepNav) return null;
    return this.$refs.stepNav.getPreviousNav();
  }
  getNextNav() {
    if (!this.$refs.stepNav) return null;
    return this.$refs.stepNav.getNextNav();
  }
  get isNew() {
    //if (!this.id) return true;
    return !this.id;
  }
  get maxNavigation() {
    if (this.isNew) {
      return "BASIC_INFORMATION";
    }


  }

  navClick(value) {
    this.currentView = value;
  }

  async mounted() {
    this.toastService.set(this);

    //this.campaignId = this.$route.params.id;

  }
  isValid(){
    
    if(this.$refs.stepBasicInformation.isValid())
    {
      return true;
    }
    return false;
  }
  navigateNext() {
    if(!this.isValid())
    {
return;
    }
    

    let nextNav = this.getNextNav();
    this.toastService.success( nextNav);
    if(!nextNav) return;
    this.currentView = nextNav;
  }
  navigatePrevious() {
    let previousNav = this.getPreviousNav();
    if(!previousNav) return;
    this.currentView = previousNav;
  }
}