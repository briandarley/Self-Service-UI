import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'campaign-communications',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailResponseTemplates']

})
export default class CampaignCommunications extends Vue {
  messageAction = {
    campaignMessage: "",
    title: "",
    message: "",
    actionCode: ""

  }

  async mounted() {
    this.toastService.set(this);
  }

  reset() {
    this.messageAction = {
      campaignMessage: "",
      title: "",
      message: "",
      actionCode: ""

    }
  }

  hide() {
    this.$refs.confirmCampaignAction.hide();
    this.$emit("cancel");
    this.reset();
  }

  async confirm() {
    this.$emit("confirm", this.messageAction);
    this.hide();
  }


  show(model) {
    switch (model.action) {
      case "send-now":
        this._showSendNowCampaignDialog(model.entity.id, model.entity.subject);
        break;
      case "deny":
        this._showDenialCampaignDialog(model.entity.id, model.entity.subject, model.population);
        break;
      case "approve":
        this._showApprovalCampaignDialog(model.entity.id, model.entity.subject, model.population);
        break;
      case "contact":
        this._showContactCampaignDialog(model.entity.id, model.entity.subject);
        break;
      case "cancel":
        this._showCancelCampaignDialog(model.entity.id, model.entity.subject);
        break;
      default:
        this.toastService.error("Failed to identify action " + model.action);
        window.console.log("Action Not Registered")
        window.console.log(args);
        break;
    }
  }






  _showSendNowCampaignDialog(campaignId, subject) {

    this.messageAction.title = `Send campaign now for campaign Id ${campaignId}`;

    this.messageAction.actionCode = "APPROVED_FOR_SEND_NOW";
    this.messageAction.id = campaignId;

    this.messageAction.message = this.MassMailResponseTemplates.getSendNowNotificationTemplate({
      id: campaignId,
      subject: subject,
      messageType: "APPROVED_FOR_SEND_NOW"
    })
    this.$refs.confirmCampaignAction.show();
  }

  _showApprovalCampaignDialog(campaignId, subject, population) {
    this.messageAction.title = `Deny ${population} for campaign Id ${campaignId}`;

    let action = "";
    if (population == "employee") {
      action = "APPROVED_EMPLOYEES";
    } else {
      action = "APPROVED_STUDENTS";
    }

    this.messageAction.actionCode = action;
    this.messageAction.id = campaignId;



    this.messageAction.message = this.MassMailResponseTemplates.getApprovalNotificationTemplate({
      id: campaignId,
      subject: subject,
      messageType: action,
      populationType: population
    })
    this.$refs.confirmCampaignAction.show();
  }

  _showDenialCampaignDialog(campaignId, subject, population) {
    this.messageAction.title = `Deny ${population} for campaign Id ${campaignId}`;

    let action = "";
    if (population == "employee") {
      action = "DENIED_EMPLOYEES";
    } else {
      action = "DENIED_STUDENTS";
    }

    this.messageAction.actionCode = action;
    this.messageAction.id = campaignId;



    this.messageAction.message = this.MassMailResponseTemplates.getDeniedTemplate({
      id: campaignId,
      subject: subject,
      messageType: action,
      populationType: population
    })
    this.$refs.confirmCampaignAction.show();
  }

  _showContactCampaignDialog(campaignId, subject) {
    this.messageAction.title = `Contact User about campaign Id ${campaignId}`;
    this.messageAction.actionCode = "COMMENT";
    this.messageAction.id = campaignId;

    this.messageAction.message = this.MassMailResponseTemplates.getContactAuthorTemplate({
      id: campaignId,
      subject: subject,
      messageType: 'COMMENT'
    })
    this.$refs.confirmCampaignAction.show();
  }

  _showCancelCampaignDialog(campaignId, subject) {
    this.messageAction.title = "Confirm Append Cancel Message?";
    this.messageAction.actionCode = "CANCELED";
    this.messageAction.id = campaignId;

    this.messageAction.message = this.MassMailResponseTemplates.getCancelNotificationTemplate({
      id: campaignId,
      subject: subject,
      messageType: 'CANCEL'
    })
    this.$refs.confirmCampaignAction.show();
  }
}