import Vue from "vue"
import {
  Component
} from "vue-property-decorator";
import ActionMenu from "./action-menu/action-menu.vue"
import ApprovalActions from "./approval-actions/approval-actions.vue";
import ViewHistory from "./view-history/view-history.vue";
import ReadOnlyView from "./read-only-view/read-only-view.vue";
// import {MDCSelect} from '@material/select';
// import {MDCMenu} from '@material/menu';

@Component({
  name: 'view-request',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ScreenReaderAnnouncerService', 'MassMailService', 'UserService', 'MassMailResponseTemplates'],
  components: {
    ActionMenu,
    ApprovalActions,
    ViewHistory,
    ReadOnlyView
  },
  filters: {
    formatEmployeeCriteria(value) {
      if (value) {
        return "/ " + value;
      }
      return "";
    }
  }
})

export default class ViewRequest extends Vue {

  
  messageAction = {
    campaignMessage: "",
    title: "",
    message: "",
    actionCode: ""

  }
  pagedResponse = {};
  entities = [];
  criteria = {
    pageSize: 5,
    index: 0,
    status : "ALL",
    filterText: ""
  };
  readOnlyModel = {};

  

  async indexChanged(index){
    this.criteria.index = index;
    await this.search();
  }

  async mounted() {
    this.toastService.set(this);

    await this.search();

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail View Request");


    const $ = this.$;
    setTimeout(() => {
      $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        $(this).siblings().toggleClass("show");


        if (!$(this).next().hasClass('show')) {
          $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function () {
          $('.dropdown-submenu .show').removeClass("show");
        });

      });
    }, 1000);
  }


  async onAction(args) {


    switch (args.action) {

      case "edit":

        this.$router.push({
          name: "create-request",
          params: {
            id: args.entity.id
          }
        });
        break;

      case "send-now":
        this.showSendNowCampaignDialog(args.entity.id, args.entity.subject);
        break;


      case "deny":

        this.showDenialCampaignDialog(args.entity.id, args.entity.subject, args.population);

        break;
      case "approve":
        this.showApprovalCampaignDialog(args.entity.id, args.entity.subject, args.population);

        break;
      case "copy":
        await this.cloneCampaign(args.entity.id);
        break;
      case "contact":

        this.showContactCampaignDialog(args.entity.id, args.entity.subject);
        break;
      case "cancel":
        this.showCancelCampaignDialog(args.entity.id, args.entity.subject);
        break;
      default:
        window.console.log("Action Not Registered")
        window.console.log(args);
        break;
    }
  }

  showSendNowCampaignDialog(campaignId, subject) {

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

  showApprovalCampaignDialog(campaignId, subject, population) {
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

  showDenialCampaignDialog(campaignId, subject, population) {
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

  showContactCampaignDialog(campaignId, subject) {
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
  showCancelCampaignDialog(campaignId, subject) {
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

  async cloneCampaign(campaignId) {
    try {
      this.spinnerService.show();
      let entity = await this.MassMailService.cloneCampaign(campaignId);

      if (entity.status === false) {
        this.toastService.error(`Failed to copy campaign ${campaignId}`);
        return;
      }
      this.toastService.success(`Successfully copied campaign ${campaignId}`);

      this.$router.push({
        name: "create-request",
        params: {
          id: entity.id
        }
      });


    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to copy campaign');
    } finally {
      this.spinnerService.hide();
    }
  }

  toggleShowHistory(entity) {
    this.pagedResponse.entities.forEach(elm => {
      if (elm.id != entity.id) {
        elm.showHistory = false;
      }
    });

    entity.showHistory = !entity.showHistory;

    this.pagedResponse.entities = JSON.parse(JSON.stringify(this.pagedResponse.entities));


  }

  viewReadOnlyView(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmViewReadOnly.show();
  }

  closeConfirmViewReadOnly() {
    this.$refs.confirmViewReadOnly.hide();
  }

  async doActionRequest() {
    try {
      this.spinnerService.show();

      let response = await this.MassMailService.addAction(this.messageAction);

      if (response.status === false) {
        this.toastService.error("Failed to add action for campaign");
      }

      let statusModel = {
        campaignId: this.messageAction.id,
        status: this.messageAction.actionCode
      }

      response = await this.MassMailService.updateStatus(statusModel);

      if (!response) {
        this.toastService.error("Failed to update campaign status");
        return;
      }


      if (this.messageAction.message) {
        let commentModel = {
          campaignId: this.messageAction.id,
          comment: this.messageAction.message,
          commentTypeCode: "COMMENT"
        };

        response = await this.MassMailService.addComment(commentModel);

        if (!response) {
          this.toastService.error("Failed to add comment to campaign");
          return;
        }
      }


      this._resetMessageAction();
      this.toastService.success("Successfully updated campaign status");

      await this.search();
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve record');
    } finally {
      this.$refs.confirmCampaignAction.hide();
      this.spinnerService.hide();
    }
  }

  closeConfirmCampaignAction() {
    this.$refs.confirmCampaignAction.hide();
    this._resetMessageAction();
  }

  _resetMessageAction() {
    this.messageAction = {
      campaignMessage: "",
      title: "",
      message: "",
      actionCode: ""

    }
  }

  _resetCriteria() {
    this.criteria = {
      pageSize: 5,
      index: 0,
      status : "ALL",
      filterText: ""
    };
  }
  async search(){
    try {
      this.spinnerService.show();
      this.pagedResponse = await this.MassMailService.getMassMailRecords(this.criteria);
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve record');
    } finally {
      this.spinnerService.hide();
    }
  }

  hasApprovals(entity) {
    if (!entity.campaignStatus) return false;
    if (entity.campaignStatus.canceledDate) return false;
    return true;
  }
  approvalStatusText(entity) {
    if (!entity.campaignStatus) return `<div class="text-danger">Invalid State</div>`;
    if (entity.campaignStatus.canceledDate) return `<div class="text-danger">Request Canceled</div>`;
    if (entity.campaignStatus.deniedDate) return `<div class="text-danger">Request Denied</div>`;
    if (entity.campaignStatus.approvedDate) return `<div class="text-success">Request Approved</div>`;

    const moment = this.moment;
    
    const dt = new Date(entity.sendDate);

    if(moment().isAfter(dt))
    {
      return `<div class="text-danger">Expired</div>`;
    }
    
    return `
    <div>Pending for Employees</div>
    <div>Pending for Students</div>
`;
  }

}