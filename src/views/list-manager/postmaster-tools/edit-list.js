import Vue from "vue";
import {
  Component,
  Watch
} from "vue-property-decorator";
//import { debug } from "util";

@Component({
  name: "edit-list",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ListManagerService",
    "ValidationService"
  ],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class EditList extends Vue {
  listName = "";
  data = {};
  members = [];
  filteredMembers = [];
  filter = {};
  _currentSortDir = 1;
  _currentCol = "";
  metrics = null;
  retrievingMetrics = false;
  refreshMetrics = false;
  modelAddMember = {};
  modelUpdateMember = {};
  modelUpdateList = {};

  clickAddNewMember() {
    this.modelAddMember = {};
    this.$refs.modalAddMember.show();
  }
  clickUpdateMember(member) {
    this.modelUpdateMember = JSON.parse(JSON.stringify(member));
    this.$refs.modalUpdateMember.show();
  }
  async saveNewMember() {
    this.spinnerService.show()

    try {
      this.modelAddMember.listName = this.listName;
      this.$refs.modalAddMember.hide();

      await this.ListManagerService.addSubscriber(this.modelAddMember);
      this.toastService.success("Added Member");

      //clear filter so that user can verify themselves of success
      this.filter = {};
      await this.getMembers();

    } catch (e) {
      if (!e.message) {
        this.toastService.error(e);
        this.$refs.modalAddMember.hide();
      } else {
        window.console.log(e);
        this.toastService.error("Failed to add member");
      }

    } finally {
      this.spinnerService.hide();
    }

  }
  async updateMember() {
    this.spinnerService.show()

    try {

      this.$refs.modalUpdateMember.hide();
      let originalUser = this.members.find(c => c.memberId === this.modelUpdateMember.memberId);
      let emailAddress = originalUser.emailAddress;
      let newEmailAddress = this.modelUpdateMember.emailAddress;

      if (emailAddress !== newEmailAddress) {
        this.modelUpdateMember.emailAddress = emailAddress;
        this.modelUpdateMember.newEmailAddress = newEmailAddress;
      }

      await this.ListManagerService.updateSubscriber(this.modelUpdateMember);
      this.toastService.success("Updated Member");

      //clear filter so that user can verify themselves of success
      this.filter = {};
      await this.getMembers();

    } catch (e) {
      if (!e.message) {
        this.toastService.error(e);
        this.$refs.modalUpdateMember.hide();
      } else {
        window.console.log(e);
        this.toastService.error("Failed to update member");
      }

    } finally {
      this.spinnerService.hide();
    }
  }

  closeDialog() {
    this.$refs.modalAddMember.hide();
    this.$refs.modalUpdateMember.hide();
    this.$refs.modalUpdateList.hide();
  }
  @Watch("modelAddMember", {
    immediate: false,
    deep: true
  })
  onModelAddMemberChanged(newValue) {

    if (newValue.emailAddress === undefined || newValue.fullName === undefined) return;

    if (newValue.isListAdmin && newValue.password && newValue.password.length) {
      newValue.valid = newValue.emailAddress.length && newValue.fullName.length;
    } else if (!newValue.isListAdmin) {
      newValue.valid = newValue.emailAddress.length && newValue.fullName.length;
    } else {
      newValue.valid = false;
    }
    if (newValue.valid) {
      newValue.valid = this.ValidationService.isValidEmail(newValue.emailAddress);
    }

  }

  @Watch("modelUpdateMember", {
    immediate: false,
    deep: true
  })
  onModelUpdateMemberChanged(newValue) {

    if (newValue.emailAddress === undefined || newValue.fullName === undefined) return;

    if (newValue.isListAdmin && newValue.password && newValue.password.length) {
      newValue.valid = newValue.emailAddress.length && newValue.fullName.length;
    } else if (!newValue.isListAdmin) {
      newValue.valid = newValue.emailAddress.length && newValue.fullName.length;
    } else {
      newValue.valid = false;
    }
    if (newValue.valid) {
      newValue.valid = this.ValidationService.isValidEmail(newValue.emailAddress);
    }

  }


  @Watch("filter", {
    immediate: false,
    deep: true
  })
  onFilterChanged(newValue) {
    let list = this.members.filter(
      c =>
      !newValue.fullName ||
      c.fullName.toUpperCase().includes(newValue.fullName.toUpperCase())
    );
    list = list.filter(
      c =>
      !newValue.email ||
      c.emailAddress.toUpperCase().includes(newValue.email.toUpperCase())
    );
    list = list.filter(c => !newValue.isAdmin || c.isListAdmin === true);
    list = list.filter(
      c =>
      !newValue.holdStatus ||
      c.memberType === (newValue.holdStatus === "held" ? "held" : "normal")
    );


    this.filteredMembers = list;

    if (this._currentCol) {
      this._currentSortDir *= -1;
      this.sort(this._currentCol);
    }
  }

  sort(column) {
    this.spinnerService.show()
    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }
    this._currentCol = column;

    switch (column) {
      case "fullName":
        this.filteredMembers.sort((a, b) => {
          if (a.fullName.toLowerCase() > b.fullName.toLowerCase())
            return this._currentSortDir;
          if (a.fullName.toLowerCase() < b.fullName.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "email":
        this.filteredMembers.sort((a, b) => {
          if (a.emailAddress.toLowerCase() > b.emailAddress.toLowerCase())
            return this._currentSortDir;
          if (a.emailAddress.toLowerCase() < b.emailAddress.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "admin":
        this.filteredMembers.sort((a, b) => {
          if (a.isListAdmin < b.isListAdmin) return this._currentSortDir;
          if (a.isListAdmin > b.isListAdmin) return this._currentSortDir * -1;
          return 0;
        });
        break;
    }
    this.spinnerService.hide();
  }

  async toggleHold(member) {
    member.memberType = member.memberType === "held" ? "normal" : "held";


    let model = {
      listName: this.listName,
      emailAddress: member.emailAddress,
      memberType: member.memberType
    };


    this.ListManagerService.updateSubscriber(model)
      .then(() => {
        this.toastService.success("Updated hold status for member");
      })
      .catch(() => {
        member.memberType = member.memberType === "held" ? "normal" : "held";
        this.toastService.error("Failed to update member status");
      });
  }

  async removeMember(member) {

    this.spinnerService.show();
    this.ListManagerService.removeSubscriber(member)
      .then(() => {
        this.toastService.success("Removed Member");
        let index = this.members.findIndex(c => c.memberId == member.memberId);
        this.members.splice(index, 1);

        //clear filter so that user can verify themselves of success
        this.filter = {};
      })
      .catch(e => {
        window.console.log(e);
        this.toastService.error("Failed to remove member");
      })
      .finally(() => {
        this.spinnerService.hide();

      });




  }

  async confirmToggleListEnable() {
    let model = JSON.parse(JSON.stringify(this.data));
    this.closeDialog();
    this.ListManagerService.toggleListEnable(model)
      .then(() => {
        this.data.disabled = !this.data.disabled;
        this.toastService.success("Updated table status");
      })
      .catch(() => {
        this.toastService.error("Failed to update table status");
      })
      .finally(() => {

      });
  }

  toggleListEnable() {
    this.modelUpdateList = {};

    let title = this.data.disabled ? "Enable List?" : "Disable List?";

    this.modelUpdateList.title = title;
    this.modelUpdateList.html = `<div class="">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
         ${this.data.disabled ? "Please confirm Enable List?" : "Please confirm Disable List?"}
        </div>`;


    this.modelUpdateList.confirm = this.confirmToggleListEnable;
    this.$refs.modalUpdateList.show();

  }

  confirmToggleSubscriberCap() {

    let model = JSON.parse(JSON.stringify(this.data));
    this.closeDialog();
    this.ListManagerService.toggleSubsciberCap(model)
      .then(() => {
        this.data.maxMembers = this.data.maxMembers === 0 ? 300 : 0;
        this.toastService.success("Updated Max Subscribers");
      })
      .catch(() => {

        this.toastService.error("Failed to update  Max Subscribers");
      })
      .finally(() => {

      });
  }

  toggleSubsciberCap() {
    this.modelUpdateList = {};

    let title = this.data.maxMembers === 0 ? "Enforce Subscriber Cap?" : "Turn Off Subscriber Cap?";

    this.modelUpdateList.title = title;
    this.modelUpdateList.html = `<div class="">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
         ${this.data.maxMembers === 0 ? "Enforce Subscriber Cap?" : "Turn Off Subscriber Cap?"}
        </div>`;


    this.modelUpdateList.confirm = this.confirmToggleSubscriberCap;
    this.$refs.modalUpdateList.show();

  }

  async confirmDeleteList() {
    this.spinnerService.show();
    this.closeDialog();
    try {
      await this.ListManagerService.deleteList(this.data);

      this.toastService.success("Deleted List");
      this.$router.push({
        name: `listserv-postmaster-tools`
      });


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete list");
    } finally {
      this.spinnerService.hide();
    }

  }

  deleteList() {
    this.modelUpdateList = {};

    let title = "Delete List?";

    this.modelUpdateList.title = title;
    this.modelUpdateList.html = `<div class="">
        <div class="info text-danger">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
         <p>
         Confirm Delete "${this.data.listName}"?
         </p>
        </div>`;


    this.modelUpdateList.confirm = this.confirmDeleteList;
    this.$refs.modalUpdateList.show();
  }

  getMetrics() {
    this.retrievingMetrics = true;
    this.refreshMetrics = false;

    this.ListManagerService.getListMetrics(this.listName)
      .then(data => {
        this.metrics = data[0];
      })
      .catch(e => {
        if (e.message.includes("404")) {
          this.refreshMetrics = true;
        }
      })
      .finally(() => {
        this.retrievingMetrics = false;
      });
  }

  async getMembers() {
    this.spinnerService.show();

    try {
      this.members = await this.ListManagerService.getSubscribersByListName(
        this.listName
      );
      this.filteredMembers = this.members;
    } catch (e) {
      this.toastService.error(`Failed to retrieve members`);
      window.console.log(e);
    } finally {
      this.spinnerService.hide();
    }
  }
  async getList() {
    this.spinnerService.show();
    try {
      return await this.ListManagerService.getListsByName(this.listName);
    } catch (e) {
      this.toastService.error(`Failed to retrieve list ${this.listName}`);
      window.console.log(e);

      this.$router.push({
        name: "listserv-postmaster-tools"
      });
    } finally {
      this.spinnerService.hide();
    }
  }

  async mounted() {
    this.toastService.set(this);
    this.listName = this.$route.params.listName;
    this.data = await this.getList();

    await this.getMembers();
    this.getMetrics();
  }

}