import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'my-ad-groups',
  dependencies: ['$', 'DashboardService', 'spinnerService', 'toastService'],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})

export default class MyAdGroups extends Vue {
  groups = [];
  members = [];
  showEntitySearch = false;
  selectedMember = "";
  deleteMember = {};
  selectedGroup = "";
  memberSearch = "";
  foundEntity = null;
  recursive = false;

  @Watch("selectedMember", {
    immediate: false
  })
  async onSelectedMemberChanged() {
    this._clearForm();
  }
  @Watch("selectedGroup", {
    immediate: false
  })
  async onSelectedGroupChanged(newvalue) {

    let response = await this.DashboardService.getGroupMembers(newvalue);
    this.members = response.data;

    this.selectedMember = this.members[0].distinguishedName;
  }
  async addEntityClick() {
    this.spinnerService.show();
    try {
      if (this.selectedGroup && this.foundEntity) {
        let response = await this.DashboardService.addEntityToGroup(this.selectedGroup, this.foundEntity, this.recursive);
        this.toastService.success("Successfully added entity to group");
        this.foundEntity = null;
      }
    } catch (e) {
      this.toastService.error("Failed to add entity to group");
    }
    this.spinnerService.hide();

  }
  showEntitySearchClick() {
    this.showEntitySearch = !!this.selectedMember;
  }
  cancelAddMemberClick() {
    this._clearForm();
  }

  _clearForm() {
    this.showEntitySearch = false;
    this.foundEntity = null;
    this.recursive = false;
    this.memberSearch = "";

  }
  async removeEntityClick() {
    this.spinnerService.show();
    try {
      if (this.selectedGroup && this.selectedMember) {
        let response = await this.DashboardService.removeEntityFromGroup(this.selectedGroup, this.selectedMember);
        this.toastService.success("Successfully removed entity from group");

        this.selectedMember = null;
        if (this.members.length > 0) {
          this.selectedMember = this.members[0].distinguishedName;
        }
      }
    } catch (e) {
      this.toastService.error("Failed to remove entity from group");
    }
    this.$refs.confirmDeleteMember.hide();
    this.spinnerService.hide();
  }
  confirmRemoveEntityClick() {
    this.deleteMember = this.members.find(c => c.distinguishedName === this.selectedMember);
    this.$refs.confirmDeleteMember.show();
  }
  removeEntityCancelClick() {
    this.$refs.confirmDeleteMember.hide();
  }
  async findMemberClick() {
    this.spinnerService.show();
    this.foundEntity = null;
    try {
      let response = await this.DashboardService.findMember(this.memberSearch);
      this.foundEntity = response.data;
      this.memberSearch = "";
      this.toastService.success("Found user");
    } catch (e) {
      this.toastService.error("Failed to retrieve user")
    }
    this.spinnerService.hide();
  }

  async mounted() {
    //child views are 'mounted' before parent is 'mounted' 
    this.toastService.set(this);
  }
  async created() {
    this.spinnerService.show();
    //called before child views are mounted
    var response = await this.DashboardService.getMyAdGroups();
    if (response.data) {
      this.groups = response.data.sort((a, b) => {
        if (a.displayName > b.displayName) {
          return 1;
        } else if (a.displayName < b.displayName) {
          return -1;
        }
        return 0;
      });
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0].displayName;
      }
    }
    this.spinnerService.hide();
  }
}