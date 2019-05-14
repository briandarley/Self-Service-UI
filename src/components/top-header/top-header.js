import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'top-header',
    dependencies: ['UserService'],
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class TopHeader extends Vue {
  name = "";
  async mounted() {
    let user = await this.UserService.get();
    this.name =  user.profile.preferred_username;
  }
  async getName(){
    let user = await this.UserService.get();
    return  user;
  }
  async signOut(){
      await this.UserService.logout();
  }
}


