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
  unmodifiedModel = {};
  userId = "";

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
    return "";

  }


  navClick(value) {
    this.currentView = value;
  }

  created() {
    this._resetModel();
  }

  async mounted() {

    this.toastService.set(this);

    await this.getUser();

    this._resetModel();

    let response = await this.loadCampain();

    
    if (!response) {
      this.$router.push({
        name: "massmail"
      });
    }



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

    if (!nextNav) {
      return;
    }

    if (!skipSave) {
      let response = await this.save();

      if (response) {
        this.currentView = nextNav;
      }
    } else {
      this.currentView = nextNav;
    }
  }


  navigatePrevious() {
    let previousNav = this.getPreviousNav();
    if (!previousNav) return;
    this.currentView = previousNav;
  }

  async getUser() {
    let user = await this.UserService.get();
    this.userId = user.profile.sub
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

      if (!this.allowedSave()) {
        return;
      }
      
      this.spinnerService.show();
      
      //Ask if the user wishes to submit the request for review
      if (status) {
        if (this.model.campaignStatus.status == "SAVED" && status == "CREATED") {
          this.$refs.confirmSubmit.show();
          return;
        }
      }
      if(this.unmodifiedModel === JSON.stringify(this.model)){
        return true;
      }
      
      let response = await this.MassMailService.save(this.model);
      
      if(response.status == false){
        this.toastService.error(response.error);
        return;
      }
      this.unmodifiedModel = JSON.stringify(this.model);

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
  async onIdChanged() {

    let response = await this.loadCampain();


    if (!response) {
      this.$router.push({
        name: "massmail"
      });
    }

  }

  async loadCampain() {
    try {
      this.spinnerService.show();
      if (!this.$route.params.id) {
        return true;
      }


      this.model = {};
      let request = await this.MassMailService.getMassMailRecord(this.$route.params.id, true);

      if (request.status === false) {
        this.toastService.error(`Failed to retrieve campaign with given id ${this.$route.params.id}`)
        return false;
      }

      let model = request[0];

      if (Array.isArray(model.comments)) {
        let initialComments = model.comments.filter(c => c.commentTypeCode === "INITIAL_AUTH_COMMENT");
        if (initialComments.length) {
          model.comments = initialComments[0].comment;
        }
      }
      
      if(model.content)
      {
        model.content = model.content.content;
      }
      this.unmodifiedModel = JSON.stringify(model);
      this.model = model;
      this.notifiedSaved = true;

      return true;


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
        name: "massmail"
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

    if (!this.$refs.stepMessageSummary.isValid()) {
      return false;
    }

    return (this.model.campaignStatus.status === "SAVED");
  }


  get allowCancel() {
    //this.model.campaignStatus.status
    if (this.isNew) return false;
    if (!this.model.author) return false;

    if (this.userId.toUpperCase() != this.model.author.toUpperCase()) {
      return false;
    }

    return this.model.campaignStatus.status === "SAVED";
    
  }


  allowedSave() {
    
    if (!this.model.id) return true;
    let editableStatuses = ["SAVED", "CREATED","NOTIFIED","DENIED_EMPLOYEES", "DENIED_STUDENTS"]
    let response = editableStatuses.indexOf(this.model.campaignStatus.status) > -1;
    if(["DENIED_EMPLOYEES", "DENIED_STUDENTS"].indexOf(this.model.campaignStatus.status) > -1)
    {
      this.model.campaignStatus.status = 'SAVED';
    }


    return  response;
  

  }

}