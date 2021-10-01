import Vue from "vue";
import { Component } from "vue-property-decorator";
import ActionMenu from "./action-menu/action-menu.vue";
import ApprovalActions from "./approval-actions/approval-actions.vue";
import ViewHistory from "./view-history/view-history.vue";
import ReadOnlyView from "./read-only-view/read-only-view.vue";
import ConfirmVerify from "./confirm-verify/confirm-verify.vue";
import CampaignCommunications from "./campaign-communications/campaign-communications.vue";
import SearchCriteria from "./search-criteria/search-criteria.vue";
import CampaignMetrics from "./campaign-metrics/campaign-metrics.vue";
import ProgressNotification from "./progress-notification/progress-notification.vue";
import "./filters/index";

@Component({
  name: "view-request",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ScreenReaderAnnouncerService",
    "MassMailService",
    "UserService",
    "SignalRService",
    "EventBus",
    "MassMailCodeValueHelperService",
  ],
  components: {
    ActionMenu,
    ApprovalActions,
    ViewHistory,
    ReadOnlyView,
    CampaignCommunications,
    SearchCriteria,
    ConfirmVerify,
    CampaignMetrics,
    ProgressNotification,
  },
})
export default class ViewRequest extends Vue {
  _currentCol = "id";
  _currentSortDir = 1;
  pagedResponse = {};
  pgResponse = {};
  entities = [];

  codeValues = [];
  criteria = {
    pageSize: 5,
    index: 0,
    status: "PENDING",
    population: "ALL",
    filterText: "",
    expireDateFrom: null,
    expireDateThru: null,
    priority: "ALL",
  };

  currentlyProcessing = [];

  readOnlyModel = {};
  showProgress() {
    //return this.currentlyProcessing.some(c=> c.campaignId == campaign.id)
  }
  getProgress(campaign) {
    return this.currentlyProcessing.find((c) => c.campaignId == campaign.id);
  }

  onNotifyBatchStateUpdateAction(model) {
    if (
      this.currentlyProcessing.some((c) => c.campaignId == model.campaignId)
    ) {
      let index = this.currentlyProcessing.findIndex(
        (c) => c.campaignId == model.campaignId
      );
      this.currentlyProcessing.splice(index, 1);
    }
    this.currentlyProcessing.push(model);

    this.currentlyProcessing = JSON.parse(
      JSON.stringify(this.currentlyProcessing)
    );
    this.entities = JSON.parse(JSON.stringify(this.entities));
  }

  onCampaignStatusUpdate(model) {
    let msg = `Campaign ${model.id} status was updated to ${
      model.campaignStatus.status
    }, updated by ${model.campaignStatus.changeUser}`;
    this.toastService.success(msg);

    if (!this.entities) return;

    for (let i = 0; i < this.pgResponse.entities.length; i++) {
      if (this.pgResponse.entities[i].id == model.id) {
        this.pgResponse.entities[i] = model;
        break;
      }
    }
    
    this.pgResponse = JSON.parse(JSON.stringify(this.pgResponse));
  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
    
  }

  displayPopulationText(entity) {
    try{
      if (!entity.audienceSelection) {
        return;
      }
  
      //associate entities with their parents
  
      let values = entity.audienceSelection.split(",").map((cv) => {
        let code = this.codeValues.find((c) => c.codeValue == cv);
  
        return code.parent ? code.parent.description : code.description;
      });
      //remove duplicates
      values = [...new Set(values.map((c) => c))];
  
      //truncate description if more than one entry is found
      return values
        .map((c) => {
          if (values.length > 1) {
            return c.substring(0, 3);
          }
          return c;
        })
        .join(",");
    }
    catch(e){
      
      window.console.log(e);
      this.toastService.error("Failed to retrieve codes")
    }
  }

  formatCodeValues(codeValues) {
    
    let reduced = codeValues.reduce((val, curVal) => {
      val.push(curVal);
      
      if (curVal.entities.length) {
        
        curVal.entities.forEach((c) => {
          c.parent = JSON.parse(JSON.stringify(curVal));
          c.parent.entities = null;
        });

        val = val.concat(curVal.entities);
      }
      return val;
    }, []);

    return reduced;
  }

  async mounted() {
    this.toastService.set(this);
    let codeValues = await this.MassMailService.getAudienceCodeValueDisplayOrder();
    

    this.codeValues = this.formatCodeValues(codeValues);

    await this.search();
    
    
    
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement(
      "Mass Mail View Request"
    );

    this.addDropDownBehavior();
    await this.SignalRService.setupConnection();

    this.EventBus.attachEvent(
      "mass-mail-campaign-status-update",
      this.onCampaignStatusUpdate
    );

    this.EventBus.attachEvent(
      "notify-batch-state-update-action",
      this.onNotifyBatchStateUpdateAction
    );
  }

  addDropDownBehavior() {
    const $ = this.$;
    setTimeout(() => {
      $("ul.dropdown-menu [data-toggle='dropdown']").on("click", function(
        event
      ) {
        event.preventDefault();
        event.stopPropagation();

        $(this)
          .siblings()
          .toggleClass("show");

        if (
          !$(this)
            .next()
            .hasClass("show")
        ) {
          $(this)
            .parents(".dropdown-menu")
            .first()
            .find(".show")
            .removeClass("show");
        }
        $(this)
          .parents("li.nav-item.dropdown.show")
          .on("hidden.bs.dropdown", function() {
            $(".dropdown-submenu .show").removeClass("show");
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
            id: args.entity.id,
          },
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
        window.console.warn("Action Not Registered");
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
        status: messageAction.code,
      };
      
      response = await this.MassMailService.updateStatus(statusModel);

      if (!response) {
        this.toastService.error("Failed to update campaign status");
        return;
      }

      if (messageAction.message) {
        let commentModel = {
          campaignId: messageAction.id,
          comment: messageAction.message,
          commentTypeCode: "COMMENT",
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
      this.toastService.error("Failed to retrieve record");
    } finally {
      this.spinnerService.hide();
    }
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
          id: entity.id,
        },
      });
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to copy campaign");
    } finally {
      this.spinnerService.hide();
    }
  }

  async toggleShowHistory(entity) {
    
    //This shouldn't be static, let's refresh each time it's requested
    let pagedResponse = await this.MassMailService.getMassMailRecords({
      id: entity.id,
    });

    this.readOnlyModel = pagedResponse.entities[0];
    this.$refs.confirmViewHistory.show();
  }

  showVerify(entity) {
    const allowedRoles = [
      "MASSMAIL_STUDENT_APPROVER",
      "MASSMAIL_EMPLOYEE_APPROVER",
      "MASSMAIL_APPROVER",
      "MASSMAIL_ADMIN",
    ];
    if (!allowedRoles.some((c) => this.UserService.isInRole(c))) return false;

    return (entity.campaignStatus && entity.campaignStatus.mailProcessDate);
    
  }

  viewShowVerify(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmVerify.show();
  }

  viewReadOnlyView(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmViewReadOnly.show();
  }

  viewConfirmCampaignMetrics(entity) {
    this.readOnlyModel = entity;
    this.$refs.confirmCampaignMetrics.show();
  }

  closeConfirmViewReadOnly() {
    this.$refs.confirmViewReadOnly.hide();
  }

  closeConfirmViewHistory() {
    this.$refs.confirmViewHistory.hide();
  }

  closeConfirmVerify() {
    this.$refs.confirmVerify.hide();
  }

  closeConfirmCampaignMetrics() {
    this.$refs.confirmCampaignMetrics.hide();
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
      listSortDirection: this._currentSortDir,
    };
  }

  async search() {
    try {
      this.spinnerService.show();
      //this.pagedResponse = { totalRecords: 0 };
      let request = await this.MassMailService.getMassMailRecords(
        this.criteria
      );
      //console.log(JSON.stringify(request));
      this.pagedResponse = JSON.parse(JSON.stringify(request));
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve record");
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
