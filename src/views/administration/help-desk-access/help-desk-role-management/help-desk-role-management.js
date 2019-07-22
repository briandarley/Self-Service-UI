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
  _currentCol = "samAccountName"
  _currentSortDir = 1;
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
  sort(column) {
    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }
    this._currentCol = column;

    switch (column) {
      case "samAccountName":
        this.entities.sort((a, b) => {
          if (a.samAccountName.toLowerCase() > b.samAccountName.toLowerCase())
            return this._currentSortDir;
          if (a.samAccountName.toLowerCase() < b.samAccountName.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "employeeId":
        this.entities.sort((a, b) => {
          if (a.employeeId.toLowerCase() > b.employeeId.toLowerCase())
            return this._currentSortDir;
          if (a.employeeId.toLowerCase() < b.employeeId.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "objectClass":
        this.entities.sort((a, b) => {
          if (a.objectClass.toLowerCase() > b.objectClass.toLowerCase())
            return this._currentSortDir;
          if (a.objectClass.toLowerCase() < b.objectClass.toLowerCase())
            return this._currentSortDir * -1;
          return 0;
        });
        break;
      case "enabled":
        this.entities.sort((a, b) => {
          
          return (a === b)? 0 : a? this._currentSortDir * -1 : this._currentSortDir;

          
        });
        break;
    }
  }
  clear() {
    this.model = {
      onyen: ""
    };
  }

}