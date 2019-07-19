import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'help-desk-role-management',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'AdministrationService'],
  props: ['roleToManage']
})

export default class HelpDeskRoleManagement extends Vue {
  model = {
    onyen: ""
  }
  entities = [];
  async getGroupUsers() {
    try {
      this.spinnerService.show();
      let data = await this.AdministrationService.getGroupMembers(this.roleToManage);
      this.entities = data;

    } catch (e) {
      window.console.log(e);
      window.console.log(this.roleToManage);
      this.toastService.error('Failed to retrieve members for group');
    } finally {
      this.spinnerService.hide();
    }
  }
  async removeMember(member) {

    try {
      this.spinnerService.show();
      await this.AdministrationService.removeGroupMember(this.roleToManage, member.samAccountName)
      this.toastService.success("Successfully removed member");
      await this.getGroupUsers();


    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to remove member');
    } finally {
      this.spinnerService.hide();
      await this.getGroupUsers();
    }
  }
  async mounted() {
    this.toastService.set(this);
    await this.getGroupUsers();
  }
  async addUserToGroup() {
    try {
      this.spinnerService.show();
      
      await this.AdministrationService.addGroupMember(this.roleToManage, this.model.onyen);

      await this.getGroupUsers();

      this.toastService.success("Successfully added member to group");

      this.clear();

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to add member to group');
    } finally {
      this.spinnerService.hide();
    }
  }
  clear() {
    this.model = {
      onyen: ""
    };
  }

}