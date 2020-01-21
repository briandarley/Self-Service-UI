import Vue from "vue"
import {
  Component
} from "vue-property-decorator";
import ActionMenu from "./action-menu/action-menu.vue"
import ApprovalActions from "./approval-actions/approval-actions.vue";
import ViewHistory from "./view-history/view-history.vue";
import ReadOnlyView from "./read-only-view/read-only-view.vue";
import ConfirmVerify from "./confirm-verify/confirm-verify.vue";
import CampaignCommunications from "./campaign-communications/campaign-communications.vue";
import SearchCriteria from "./search-criteria/search-criteria.vue";

import "./filters/index";;

@Component({
  name: 'view-request',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ScreenReaderAnnouncerService', 'MassMailService', 'UserService', 'SignalRService', 'EventBus'],
  components: {
    ActionMenu,
    ApprovalActions,
    ViewHistory,
    ReadOnlyView,
    CampaignCommunications,
    SearchCriteria,
    ConfirmVerify
  }


})

export default class ViewRequest extends Vue {
  _currentCol = "id";
  _currentSortDir = 1;
  pagedResponse = {};
  entities = [];
  criteria = {
    pageSize: 5,
    index: 0,
    status: "PENDING",
    population: "ALL",
    filterText: "",
    expireDateFrom: null,
    expireDateThru: null,
    priority: "ALL"
  };
  readOnlyModel = {};


  onCampaignStatusUpdate(model) {


    let msg = `Campaign ${model.id} status was updated to ${model.campaignStatus.status}, updated by ${model.campaignStatus.changeUser}`;
    this.toastService.success(msg)


    if (!this.entities) return;

    for (let i = 0; i < this.pagedResponse.entities.length; i++) {
      if (this.pagedResponse.entities[i].id == model.id) {
        this.pagedResponse.entities[i] = model;
        break;
      }
    }
    this.pagedResponse = JSON.parse(JSON.stringify(this.pagedResponse));
  }

  onMailBatchUpdate(model) {
    let campaignId = model.campaignId;
    let pagedResponse = model.pagedResponse;
    let currentPage = pagedResponse.index + 1;
    let totalPages = Math.ceil(pagedResponse.totalRecords / pagedResponse.pageSize);
    const $ = this.$;

    let progress = Math.round((currentPage / totalPages) * 100, 2);

    $(`#progessbar_${campaignId}`).removeClass("hidden");
    let progressBar = $(`#progessbar_${campaignId} > .progress-bar`);
    $(progressBar).width(progress + "%");


  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  async mounted() {
    this.toastService.set(this);

    await this.search();

    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail View Request");


    const $ = this.$;

    this.addDropDownBehavior();
    await this.SignalRService.setupConnection();

    this.EventBus.attachEvent('massmail-campaign-status-update', this.onCampaignStatusUpdate)
    this.EventBus.attachEvent('massmail-campaign-mail-batch-update', this.onMailBatchUpdate)
  }

  addDropDownBehavior() {
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
        // this.$router.push({
        //   name: "create-request",
        //   params: {
        //     id: args.entity.id
        //   }
        // });
        this.$router.push({
          path: `/create-request/${args.entity.id}`,
        });
        break;
      case "copy":
        await this.cloneCampaign(args.entity.id);
        break;
      case "cancel":
      case "contact":
      case "approve":
      case "deny":
      case "send-now":
        this.$refs.campaignCommunications.show(args);

        break;
      default:
        window.console.warn("Action Not Registered")
        window.console.warn(args);
        break;
    }
  }


  async onConfirmCommunication(messageAction) {
    try {
      this.spinnerService.show();

      
      let response = await this.MassMailService.addAction(messageAction);

      if (response.status === false) {
        this.toastService.error("Failed to add action for campaign");
      }

      let statusModel = {
        campaignId: messageAction.id,
        status: messageAction.actionCode
      }

      response = await this.MassMailService.updateStatus(statusModel);

      if (!response) {
        this.toastService.error("Failed to update campaign status");
        return;
      }


      if (messageAction.message) {
        let commentModel = {
          campaignId: messageAction.id,
          comment: messageAction.message,
          commentTypeCode: "COMMENT"
        };

        response = await this.MassMailService.addComment(commentModel);

        if (!response) {
          this.toastService.error("Failed to add comment to campaign");
          return;
        }
      }

      this.toastService.success("Successfully updated campaign status");

      await this.search();

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve record');
    } finally {

      this.spinnerService.hide();
    }
  }

  onHideCommunication() {
    //this.$refs.campaignCommunications.hide()
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
    this.readOnlyModel = entity;
    this.$refs.confirmViewHistory.show();

  }
  showVerify(entity){
    const allowedRoles = ["MASSMAIL_STUDENT_APPROVER","MASSMAIL_EMPLOYEE_APPROVER","MASSMAIL_APPROVER","MASSMAIL_ADMIN"]
    if(!allowedRoles.some(c=> this.UserService.isInRole(c))) return false;

    return entity.campaignStatus.mailProcessDate;
    
  }
  viewShowVerify(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmVerify.show();
  }
  viewReadOnlyView(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmViewReadOnly.show();
  }
  
  closeConfirmViewReadOnly() {
    this.$refs.confirmViewReadOnly.hide();
  }
  closeConfirmViewHistory(){
    this.$refs.confirmViewHistory.hide();
  }
  closeConfirmVerify(){
    this.$refs.confirmVerify.hide();
  }



  _resetCriteria() {
    this.criteria = {
      pageSize: 5,
      index: 0,
      status: "PENDING",
      population: "ALL",
      filterText: "",
      expireDateFrom: null,
      expireDateThru: null,
      priority: "ALL",
      sort: this._currentCol,
      listSortDirection: this._currentSortDir
    };
  }

  async search() {
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


  async clear() {
    this._resetCriteria();
    await this.search();
  }

  async sort(column) {

    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }
    this._currentCol = column;

    this.criteria.index = 0;
    this.criteria.sort = this._currentCol;
    this.criteria.listSortDirection = this._currentSortDir;
    await this.search();



  }


}