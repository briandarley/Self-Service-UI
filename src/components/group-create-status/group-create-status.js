import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "group-create-status",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "EventBus",
    "SignalRService",
    "UserService",
  ],
  components: {},
})
export default class GroupCreateStatus extends Vue {
  model = {};
  userId = "";
  adGroupQueue = {};
  acknowledge = false;
  groupProcessing = [];
  
  explicitHideProgressBar = false;
  progressBarComplete = false;
  //set initial progressbar time out so that it doesn't initially show
  progressBarTimedOut = true;

  progressMessage = "";
  currentGroupName = "";
  width = 0;
  get hideProgressBar() {
    if (this.explicitHideProgressBar) return true;
    if (this.progressBarComplete) return true;
    if(this.progressBarTimedOut) return true;

    return false;
  }
  async mounted() {
    this.toastService.set(this);

    let user = await this.UserService.get();
    this.userId = user.profile.sub;

    this.SignalRService.setupConnection();
    // this.EventBus.attachEvent("NotifyGroupCreated", this.onGroupCreated);
    // this.EventBus.attachEvent("NotifyGroupCurrentStepProcessing", this.onNotifyGroupCurrentStepProcessing);
    this.EventBus.attachEvent(
      "NotifyGroupProcessUpdate",
      this.onNotifyGroupProcessUpdate
    );
    this.width = 0;
    this.progressBarComplete = false;
    this.progressMessage = "";
  }

  async onNotifyGroupProcessUpdate(model) {
    if(!this.UserService.isInRole("ADMIN") && model.author !== this.userId) return;
    
    //window.console.log(model);

    if(!this.currentGroupName)
    {
      this.currentGroupName = model.groupName;
    }
  

    
    
    switch (model.type) {
      case "PROGRESS":
        await this.onNotifyGroupCurrentStepProcessing(model);
        break;
      case "GROUP_CREATED_NOTICE":
        await this.onGroupCreated(model);
        break;
      case "ERROR":
        this.onNotifyGroupError(model);
        break;
      default:
        this.toastService.error("Unrecognized service message received");
        window.console.log(model);
    }

    
  }

  onNotifyGroupError(model) {

    
    this.toastService.error(`Group creation failed, ${model.message}`);

  }
  _timeout
  async onNotifyGroupCurrentStepProcessing(model) {
    
    if(this.currentGroupName && this.currentGroupName !== model.groupName) return;

    this.width = Math.round((model.stepIndex / model.totalSteps) * 100);
    this.progressMessage = `Processing ${model.currentStepName}, ${
      model.stepIndex
    } of ${model.totalSteps}`;

    if (model.message) {
      this.toastService.success(model.message);
    }

    this.progressBarComplete = model.stepIndex == model.totalSteps;
    
    //we don't want multiple groups if any to confuse user, only show one progress bar at a time
    if(this.progressBarComplete) {
      this.currentGroupName = "";
    }
    this.progressBarTimedOut = false;

    clearTimeout(this._timeout);

    this._timeout = setTimeout(() => {
      //hide progress bar afer a minute
      this.progressBarTimedOut = true;
    }, 1000 * 10);


  }

  hideProgress() {
    this.explicitHideProgressBar = true;
  }

  async onGroupCreated(model) {
    if (!model) return;
    if (!model.adGroupQueue) return;
    if (!model.adGroupQueue.createUser) return;

    if (
      model.adGroupQueue.createUser.toUpperCase() ==
        this.userId.toUpperCase() ||
      this.UserService.isInRole("ADMIN")
    ) {
      if (this.acknowledge) {
        this.groupProcessing.push(model);
        return;
      }

      this.acknowledge = true;
      this.model = model;
      this.adGroupQueue = model.adGroupQueue;

      this.toastService.success("Successfully created");

      this.$refs.groupCreated.show();
      // if (model.type == "PROGRESS") {
        
      // }
    }
  }
  async onConfirmgroupCreatedClick() {
    this.$router.push({
      name: "ad-group-members",
      query: {
        distinguishedName: this.adGroupQueue.distinguishedName,
      },
    });

    this.$refs.groupCreated.hide();
  }
  async onCancelgroupCreatedClick() {
    this.$refs.groupCreated.hide();
  }

  async onClose() {
    this.acknowledge = false;

    //allow the dialog to close and dispose
    if (this.groupProcessing.length) {
      setTimeout(async () => {
        let model = this.groupProcessing.pop();
        await this.onGroupCreated(model);
      }, 1000);
    }
  }
}
