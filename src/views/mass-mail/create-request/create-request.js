import {
  BaseValidateMixin
} from "./../../../components/mixins/index";
import {
  Component,
  Watch
} from "vue-property-decorator";
import StepNavigation from './nav/step-navigation.vue';
import BasicInformation from './steps/basic-information/basic-information.vue';
import AudienceCriteria from './steps/audience-criteria/audience-criteria.vue';
import MessageContents from './steps/message-contents/message-contents.vue';
import MessageSummary from './steps/message-summary/message-summary.vue'

@Component({
  name: 'create-request',
  dependencies: ['$', 'toastService', 'spinnerService', 'MassMailService', 'ScreenReaderAnnouncerService', 'UserService'],
  components: {
    StepNavigation,
    BasicInformation,
    AudienceCriteria,
    MessageContents,
    MessageSummary,

  },
  props: ['id']
})

export default class CreateRequest extends BaseValidateMixin {
  loaded = true;
  confirmedSave = false;
  notifiedSaved = false;
  currentView = "BASIC_INFORMATION";
  model = {};

  _resetModel() {

    this.confirmedSave = false;

    this.model = {

      sendFrom: "",
      sendDate: this._addDays(0),
      expirationDate: this._addDays(3),
      replyTo: "",
      subject: "",
      sponsoringUniversity: "",
      priority: ""

    }
  }

  _addDays(days) {
    var result = new Date();
    result.setDate(result.getDate() + days);
    return result;
  }

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
    if (this.confirmedSave || this.model.id) return false;
    //if (!this.id) return true;
    return !this.model.id;
  }

  get maxNavigation() {
    if (this.isNew) {
      return "BASIC_INFORMATION";
    }


  }

  get allowCancel() {

    if (this.isNew) return false;

    return (async () => {
      let user = await this.UserService.get();
      let userId = user.profile.sub

      if (this.model.author.toUpperCase() != userId.toUpperCase()) {
        return false;
      }

      return true;
    });
  }

  navClick(value) {
    this.currentView = value;
  }

  created() {
    this._resetModel();
  }

  async mounted() {

    this.toastService.set(this);

    this._resetModel();

    this.loadCampain();


    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Create Request");
  }

  isValid() {

    if (this.$refs.stepBasicInformation && this.$refs.stepBasicInformation.isValid()) {
      return true;
    } else if (this.$refs.stepAudienceCriteria && this.$refs.stepAudienceCriteria.isValid()) {
      return true;
    } else if (this.$refs.stepMessageContents && this.$refs.stepMessageContents.isValid()) {
      return true;
    }
    return false;
  }

  async navigateNext(skipSave) {
    if (!this.isValid()) {
      this.toastService.error("Form invalid")
      return;
    }

    if (this.isNew) {
      this.$refs.confirmSave.show();
      return;
    }

    let nextNav = this.getNextNav();

    if (!nextNav) return;

    if (!skipSave) {
      let response = await this.save();

      if (response) {
        this.currentView = nextNav;
      }
    }
    else{
      this.currentView = nextNav;
    }
  }


  navigatePrevious() {
    let previousNav = this.getPreviousNav();
    if (!previousNav) return;
    this.currentView = previousNav;
  }


  cancelSubmit() {
    this.$refs.confirmSubmit.hide();
  }
  async confirmSubmit() {
    try {
      this.spinnerService.show();

      this.model.campaignStatus.status = "CREATED";

      await this.MassMailService.save(this.model);

      this.toastService.success("Successfully submited record for review");

      this.$refs.confirmSubmit.hide();

      setTimeout(() => {
        this.$router.push({
          name: "massmail"
        });

       
      }, 500);

    } catch (e) {

      this.confirmedSave = false;

      window.console.log(e);

      this.toastService.error('Failed to submit record');

      return false;
    } finally {
      this.spinnerService.hide();
    }
  }


  //confirmSubmit cancelSubmit confirmSubmit
  async save(status) {
    try {
      this.spinnerService.show();

      if (status) {
        if (this.model.campaignStatus.status == "SAVED" && status == "CREATED") {
          this.$refs.confirmSubmit.show();
          return;
        }
      }

      let response = await this.MassMailService.save(this.model);

      //Avoid too many anoying notifications
      if (!this.notifiedSaved) {
        this.toastService.success("Successfully saved record");
        this.notifiedSaved = true;
      }


      return response;
    } catch (e) {
      this.confirmedSave = false;
      window.console.log(e);
      this.toastService.error('Failed to save record');
      return false;
    } finally {
      this.spinnerService.hide();
    }
  }
  @Watch("$route.params.id")
  onIdChanged() {
    this.loadCampain();
  }

  async loadCampain() {
    try {
      this.spinnerService.show();

      if (this.$route.params.id) {

        let campaign = await this.MassMailService.getMassMailRecord(this.$route.params.id);
        this.model = campaign;
        this.notifiedSaved = true;

      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load campaign');
    } finally {
      this.spinnerService.hide();
    }
  }

  async confirmSave() {

    this.confirmedSave = true;

    this.$refs.confirmSave.hide();

    let response = await this.save();


    if (response) {
      this.$router.push({
        name: "create-request",
        params: {
          id: response.id
        }
      })
      this.navigateNext(true);

    }
  }

  cancelRequest() {
    this.$refs.confirmCancel.show();
    return;
  }

  async confirmCancel() {
    try {
      this.spinnerService.show();

      await this.MassMailService.removeMassMailCampaign(this.$route.params.id);

      this.toastService.success("Successfully canceled MassMail campaign");

      this._resetModel();

      this.$router.push({
        name: "create-request"
      })



      this.$refs.confirmCancel.hide();
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to cancel MassMail campaign');
    } finally {
      this.spinnerService.hide();
    }
  }

  cancelCancelRequest() {
    this.$refs.confirmCancel.hide();
  }

  get allowSubmit() {
    return this.$refs.stepMessageSummary.isValid();

  }

}